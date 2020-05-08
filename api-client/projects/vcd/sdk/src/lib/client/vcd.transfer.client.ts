import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {catchError, expand, flatMap, last, map, reduce, retry, switchMap, tap} from 'rxjs/operators';
import {VcdHttpClient} from './vcd.http.client';

/**
 * Default chunk size is 50MiB.  This is equal to the chunk size the VCD UI uses for library uploads.
 */
export const MAX_CHUNK_SIZE = 50 * 1024 * 1024;

/**
 * How many times to retry a chunk upload.
 */
export const MAX_CHUNK_RETRY_COUNT = 5;

/**
 * Details about a completed file transfer.
 */
export interface TransferResult {
    /**
     * Filename being transferred.
     */
    filename: string|'<blob>';

    /**
     * URL being used for the transfer.
     */
    transferUrl: string;

    /**
     * How many retries in total were required
     */
    retryCount: number;

    /**
     * The number of chunks that have been sent.
     */
    chunksSent: number;

    /**
     * How many bytes have been sent.
     */
    bytesSent: number;

    /**
     * How many milliseconds that have elapsed since starting the transfer.
     */
    timeTakenMs: number;
}

/**
 * Details about a file transfer in progress.
 */
export interface TransferProgress {
    /**
     * Filename being transferred.
     */
    filename: string|'<blob>';

    /**
     * URL being used for the transfer.
     */
    transferUrl: string;

    /**
     * The current retry number for the current chunk.
     */
    retryNumber: number;

    /**
     * The number of retries in total.
     */
    retryCount: number;

    /**
     * The number of chunks that have been sent.
     */
    chunksSent: number;

    /**
     * The number of chunks remaining.
     */
    chunksRemaining: number;

    /**
     * How many bytes have been sent.
     */
    bytesSent: number;

    /**
     * How many bytes remaining to be sent.
     */
    bytesRemaining: number;

    /**
     * Percentage completion.
     */
    percent: number;

    /**
     * How many milliseconds that have elapsed since starting the transfer.
     */
    timeTakenMs: number;

    /**
     * Naive estimate of time remaining.  This is not scientific at all - a simple linear extrapolation.
     */
    estimatedTimeRemainingMs: number;
}

/**
 * A special error thrown by the transfer client.  It gives access to the causing error, and the final progress
 * before the error occurred.
 */
export class TransferError extends Error {
    constructor(message: string, readonly originalError: any, readonly lastProgress: TransferProgress) {
        super(message);
    }
}

/**
 * This is used to upload files to a VCD API transfer URL.  It is not suggested to create this class - instead
 * use the startTransfer method in VcdApiClient.
 */
export class VcdTransferClient {
    /**
     * Create a transfer client.
     * @param httpClient the http client to be used
     * @param transferUrl the URL to upload to
     */
    constructor(public httpClient: VcdHttpClient, public transferUrl: string,
                public maxChunkSize = MAX_CHUNK_SIZE, public maxChunkRetryCount = MAX_CHUNK_RETRY_COUNT) {
    }

    /**
     * Upload data, optionally listening for progress updates.
     * @param source what to upload.
     * @param progressObserver (optional) this will get progress notifications during the upload
     * @returns fetails of the finished upload.
     * @throws TransferError when a chunk upload fails.
     */
    upload(source: Blob|File, progressObserver?: Observer<TransferProgress>): Observable<TransferResult> {
        // Cache the client and url so they don't change from under us.
        const {httpClient, transferUrl, maxChunkSize, maxChunkRetryCount} = this;

        // Compute static information used through the upload.
        const filename = (source as File).name || '<blob>';
        const totalChunks = Math.ceil(source.size / maxChunkSize);
        const totalBytes = source.size;
        const startTimeMs = new Date().getTime();
        let retryCount = 0;

        // This helper function creates a TransferProgress object for sending to the progressObserver.
        // It relies on the above static information, hence being nested.
        function createTransferProgress(retryNumber: number, rtryCount: number, chunksSent: number): TransferProgress {
            const chunksRemaining = totalChunks - chunksSent;
            const bytesSent = Math.min(chunksSent * maxChunkSize, totalBytes);
            const bytesRemaining = totalBytes - bytesSent;
            const percent = bytesSent / totalBytes * 100;
            const timeTakenMs = new Date().getTime() - startTimeMs;
            const estimatedTotalTimeMs = (bytesSent / bytesRemaining) * timeTakenMs;
            const estimatedTimeRemainingMs = Math.max(estimatedTotalTimeMs - timeTakenMs, 0);
            return {
                filename,  transferUrl, retryNumber, retryCount: rtryCount,
                chunksSent, chunksRemaining, bytesSent, bytesRemaining,
                percent, timeTakenMs, estimatedTimeRemainingMs
            };
        }

        // This is the main chunk upload function
        function transferChunk(chunkIndex: number): Observable<HttpResponse<any>> {
            // Calculate chunk details.
            const chunkStart = chunkIndex * maxChunkSize;
            const chunkEnd = Math.min(chunkStart + maxChunkSize, totalBytes);
            const contentRangeHeader = `bytes ${chunkStart}-${chunkEnd - 1}/${totalBytes}`;

            // Dispatch progress
            if (progressObserver) {
                const progress = createTransferProgress(0, retryCount, chunkIndex);
                progressObserver.next(progress);
            }

            // Read in the chunk
            return Observable.create(observer => {
                const chunkSlice: Blob = source.slice(chunkStart, chunkEnd);
                const fileReader = new FileReader();
                fileReader.onerror = err => {
                    observer.error(err);
                };
                fileReader.onabort = err => {
                    observer.error(err);
                };
                fileReader.onload = () => {
                };
                fileReader.onloadend = () => {
                    observer.next(fileReader.result);
                    observer.complete();
                };

                return fileReader.readAsArrayBuffer(chunkSlice);

            // Transfer the chunk
            }).pipe(
                // Upon read error, abort the upload process.  No point retrying read failures.
                catchError((e) => {
                    // Abandon the upload and propagate a consumable error.
                    const progress = createTransferProgress(0, retryCount, chunkIndex);
                    return Observable.throw(new TransferError('Read error', e, progress));
                }),

                // Upon successful read, transfer the chunk.
                switchMap((data) => {
                    let retryNumber = 0;
                    return httpClient.put(
                        transferUrl, data,
                        {
                            headers: new HttpHeaders({
                                'Content-Range': contentRangeHeader
                            }),
                            responseType: 'text'
                        }
                    ).pipe(
                        // This is called upon any chunk upload failure.
                        catchError((e) => {
                            // Increase the total retry count.
                            retryCount++;

                            // Increase the current chunk retry number.
                            retryNumber++;

                            // Dispatch progress (the retry information has changed).
                            if (progressObserver) {
                                const progress = createTransferProgress(retryNumber, retryCount, chunkIndex);
                                progressObserver.next(progress);
                            }

                            // Rethrow the error so that the "retry" call handles it.
                            return Observable.throw(e);
                        }),

                        // Retry the chunk upload up to the limit - this will run the entire chain again.
                        retry(maxChunkRetryCount),

                        // This is called when all retries for the chunk are exhausted.
                        catchError((e) => {
                            // Abandon the upload and propagate a consumable error.
                            const progress = createTransferProgress(retryNumber, retryCount, chunkIndex);
                            return Observable.throw(new TransferError('Transfer error', e, progress));
                        })
                    );
                })
            );
        }

        // This creates the final transfer progress, dispatches it, and returns the transfer result.
        function finishUpload(): TransferResult {
            const transferProgress = createTransferProgress(0, retryCount, totalChunks);
            if (progressObserver) {
                progressObserver.next(transferProgress);
                progressObserver.complete();
            }

            const transferResult: TransferResult = {
                filename: transferProgress.filename,
                transferUrl: transferProgress.transferUrl,
                retryCount: transferProgress.retryCount,
                chunksSent: transferProgress.chunksSent,
                bytesSent: transferProgress.bytesSent,
                timeTakenMs: transferProgress.timeTakenMs
            };
            return transferResult;
        }

        // Upload all of the chunks
        let chain = transferChunk(0);
        for (let currentChunk = 1; currentChunk < totalChunks; currentChunk++) {
            chain = chain.pipe(
                flatMap(() => transferChunk(currentChunk))
            );
        }

        // Finish transfer
        return chain.pipe(map(finishUpload));
    }
}

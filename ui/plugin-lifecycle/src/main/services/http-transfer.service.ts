/*
 * Copyright 2017 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subscriber, Subscription} from "rxjs/Rx";

export const CHUNK_SIZE = 5 * 10 * 1024 * 1024;
export const PARALLEL_REQUESTS = 3;

const CHUNK_UPLOAD_RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;
const RESPONSE_TYPE = "text";

export interface FileUpload {
    file: File;
    url: string;
    offset?: number;
}

interface ObservableUploadTask {
    task: FileUpload;
    subject: BehaviorSubject<number>;
}

@Injectable()
export class HttpTransferService {
    private uploadTasks: ObservableUploadTask[] = [];
    protected runningTasks: Set<ObservableUploadTask> = new Set();

    /**
     * Get chunk headers
     * @param offset Chunk offset bytes
     * @param end Chunk end byte
     * @param fileSize File size
     * @param headers Additional headers
     */
    private getChunkHeader(offset: number, end: number, fileSize: number, headers = {}) {
        return new Headers({
            ...headers,
            "Content-Range": `bytes ${offset} - ${end} / ${fileSize}`
        });
    }

    /**
     * Calculate upload progress based on the uploaded bytes and total bytes to be transferred.
     *
     * @param uploaded Uploaded bytes
     * @param total Total bytes of files
     *
     * @returns number in range 0 - 100
     */
    private getProgress(uploaded: number, total: number) {
        return Math.floor(100 * (uploaded / total));
    }

    /**
     * Process single file - chunk it and upload each chunk in sequential order.
     *
     * @param file File to upload
     * @param url Url where file shall be uploaded
     * @param offset optional Starting byte for upload.
     * @param headers optional Additional headers that shall be add into the upload request
     */
    private processFile(file: File, url: string, offset = 0, headers: {}): Observable<number> {
        const chunkSize = this.chunkSize;
        const fileSize = file.size;

        return Observable.create((subscriber: Subscriber<number>) => {
            let end: number;
            let blob: Blob;
            let uploadSubscription: Subscription;
            let readSubscription: Subscription;
            const reader = new FileReader();

            const readerErrorObservable = Observable.fromEvent(reader, "error");
            const readerAbortObservable = Observable.fromEvent(reader, "abort");
            const readerLoadEndObservable = Observable.fromEvent(reader, "loadend");

            const readNext = () => {
                end = Math.min(offset + chunkSize, file.size);
                blob = file.slice(offset, end);
                reader.readAsArrayBuffer(blob);
            };

            // Complete when fail to read file
            readerErrorObservable.merge(readerAbortObservable).subscribe(() => {
                subscriber.error(reader.error);
            });

            // Upload on read end
            readSubscription = readerLoadEndObservable.subscribe(
                () => {
                    const uploadObservable = this.uploadChunk(
                        blob,
                        url,
                        this.getChunkHeader(offset, end, fileSize, headers)
                    );
                    uploadSubscription = uploadObservable.subscribe(
                        (event) => {
                            console.log(event);
                            
                            // if (event.type === HttpEventType.UploadProgress) {
                                subscriber.next(offset + event.loaded);
                                return;
                            // }
                        },
                        (error) => subscriber.error(error),
                        () => {
                            if (end >= file.size || (subscriber.closed)) {
                                subscriber.complete();
                            } else {
                                offset = end;
                                readNext();
                            }
                        }
                    );
                }
            );
            readNext();

            // Clean up - unsubscribe from upload and read Observables
            return () => {
                if (uploadSubscription) {
                    uploadSubscription.unsubscribe();
                }

                if (readSubscription) {
                    readSubscription.unsubscribe();
                }

                subscriber.unsubscribe();
            };
        });
    }

    /**
     * Upload single chunk.
     *
     * @param blob
     * @param url
     * @param headers
     *
     * @returns An observable that completes when chunk is uploaded.
     */
    private uploadChunk(blob: Blob, url: string, headers: Headers) {
        const opts = new RequestOptions();
        opts.headers = headers;

        return this.httpClient.put(url, blob, opts)
                .retryWhen((error) => error.flatMap((error) => {
                    if (error.status !== 200) {
                        return Observable.of(error).delay(RETRY_TIMEOUT);
                    }

                    return Observable.throw(error.error);
                }).take(CHUNK_UPLOAD_RETRY_COUNT).concat(
                    Observable.throw({
                        error: "Error in zip uploading..."
                    }))
                );
    }

    constructor(
        private httpClient: Http,
        private chunkSize: number,
        private parallelRequests: number
    ) {}

    /**
     * Flag that indicates weather service is uploading files.
     * @returns {boolean}
     */
    get isUploading() {
        return !!this.runningTasks.size || !!this.uploadTasks.length;
    }

    /**
     * Uploads 1 or multiple files in chunks.
     * Files are uploaded in parallel based on the service configuration.
     * Chunks are uploaded in sequence.
     */
    upload(headers: {}, ...tasks: FileUpload[]): Observable<number> {
        const parallel = this.parallelRequests;
        const total = tasks.reduce((ac, item) => (ac + item.file.size), 0);

        // Map each task to pair {task, subject}
        // Subject is use to keep track of the progress of its paired task

        this.uploadTasks = [
            ...this.uploadTasks,
            ...tasks.map((task) => ({
                task: task,
                subject: new BehaviorSubject(task.offset || 0)
            }))
        ];

        return Observable.create((subscriber) => {
            if (!tasks.length) {
                subscriber.complete();
                return;
            }

            // Run next tasks based on the parallelRequests property value
            const runNext = () => {
                const newTasks = this.uploadTasks.splice(0, (parallel - this.runningTasks.size));

                // Run new tasks if any
                if (newTasks.length) {
                    newTasks.forEach((observableTask) => {
                        // Map each task to an observable and
                        // comlete its subject when that observable completes
                        Observable.of(observableTask)
                            // keep track of running tasks
                            .do((observableTask) => {
                                this.runningTasks.add(observableTask);
                            })
                            // map to inner upload observable
                            .concatMap((observableTask): Observable<number> => {
                                const uploadTask = observableTask.task;
                                return this.processFile(
                                    uploadTask.file,
                                    uploadTask.url,
                                    uploadTask.offset,
                                    headers
                                );
                            })
                            // complete the task's subject when upload observable completes
                            .subscribe(
                                (value) => observableTask.subject.next(value),
                                (error) => {
                                    // remove it from the running tasks
                                    this.runningTasks.delete(observableTask);
                                    subscriber.error(error);
                                    // do not continue if one of the tasks breaks
                                },
                                () => {
                                    // remove it from the running tasks
                                    this.runningTasks.delete(observableTask);
                                    observableTask.subject.complete();
                                    // run next
                                    runNext();
                                }
                            );
                    });
                }
            };

            const progressSubscription = Observable.of(0)
            .combineLatest(
                ...this.uploadTasks.map((task) => task.subject),
                (empty, ...progresses) => progresses.reduce((start, value) => (start + value), 0))
            .subscribe(
                (value) => subscriber.next(value),
                (error) => subscriber.error(error),
                ()      => subscriber.complete()
            );

            runNext();
            return () => progressSubscription.unsubscribe();
        })
        .map((value: number) => this.getProgress(value, total));
    }
}

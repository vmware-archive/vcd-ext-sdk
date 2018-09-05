import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
export declare const CHUNK_SIZE: number;
export declare const PARALLEL_REQUESTS = 3;
export interface FileUpload {
    file: File;
    url: string;
    offset?: number;
}
export interface ObservableUploadTask {
    task: FileUpload;
    subject: BehaviorSubject<number>;
}
export declare class HttpTransferService {
    private httpClient;
    private chunkSize;
    private parallelRequests;
    private uploadTasks;
    protected runningTasks: Set<ObservableUploadTask>;
    /**
     * Get chunk headers
     * @param offset Chunk offset bytes
     * @param end Chunk end byte
     * @param fileSize File size
     * @param headers Additional headers
     */
    private getChunkHeader(offset, end, fileSize, headers?);
    /**
     * Calculate upload progress based on the uploaded bytes and total bytes to be transferred.
     *
     * @param uploaded Uploaded bytes
     * @param total Total bytes of files
     */
    private getProgress(uploaded, total);
    /**
     * Process single file - chunk it and upload each chunk in sequential order.
     *
     * @param file File to upload
     * @param url Url where file shall be uploaded
     * @param offset optional Starting byte for upload.
     * @param headers optional Additional headers that shall be add into the upload request
     */
    private processFile(file, url, offset, headers);
    /**
     * Upload single chunk.
     *
     * @param blob
     * @param url
     * @param headers
     */
    private uploadChunk(blob, url, headers);
    constructor(httpClient: HttpClient, chunkSize: number, parallelRequests: number);
    /**
     * Flag that indicates weather service is uploading files.
     */
    readonly isUploading: boolean;
    /**
     * Uploads 1 or multiple files in chunks.
     * Files are uploaded in parallel based on the service configuration.
     * Chunks are uploaded in sequence.
     */
    upload(headers: {}, ...tasks: FileUpload[]): Observable<number>;
}

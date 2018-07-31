import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";

interface FileUpload {
    file: File;
    url: string;
}

@Injectable()
export class HttpTransferService {
    constructor() {}

    // Generate headers
    private generateHeaders() {}

    // Get is uploading state
    private isUploading() {}

    // Create file chunks
    private createChunks() {}

    // Upload chunks
    private uploadChunks() {}

    // Track upload progress
    private trackUploadProgress() {}

    // Process the file
    private processTheFile(file: FileUpload) {}

}

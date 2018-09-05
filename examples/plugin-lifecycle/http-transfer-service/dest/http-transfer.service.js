"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright 2017 VMware, Inc. All rights reserved. VMware Confidential
 */
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
// import { TranslationService } from "../i18n/TranslationService";
exports.CHUNK_SIZE = 5 * 10 * 1024 * 1024;
exports.PARALLEL_REQUESTS = 3;
var /** @type {?} */ CHUNK_UPLOAD_RETRY_COUNT = 5;
var /** @type {?} */ RETRY_TIMEOUT = 1000;
var /** @type {?} */ RESPONSE_TYPE = "text";
/**
 * @record
 */
function FileUpload() { }
exports.FileUpload = FileUpload;
function FileUpload_tsickle_Closure_declarations() {
    /** @type {?} */
    FileUpload.prototype.file;
    /** @type {?} */
    FileUpload.prototype.url;
    /** @type {?|undefined} */
    FileUpload.prototype.offset;
}
/**
 * @record
 */
function ObservableUploadTask() { }
exports.ObservableUploadTask = ObservableUploadTask;
function ObservableUploadTask_tsickle_Closure_declarations() {
    /** @type {?} */
    ObservableUploadTask.prototype.task;
    /** @type {?} */
    ObservableUploadTask.prototype.subject;
}
var HttpTransferService = (function () {
    function HttpTransferService(httpClient, chunkSize, parallelRequests) {
        this.httpClient = httpClient;
        this.chunkSize = chunkSize;
        this.parallelRequests = parallelRequests;
        this.uploadTasks = [];
        this.runningTasks = new Set();
    }
    /**
     * Get chunk headers
     * @param {?} offset Chunk offset bytes
     * @param {?} end Chunk end byte
     * @param {?} fileSize File size
     * @param {?=} headers Additional headers
     * @return {?}
     */
    HttpTransferService.prototype.getChunkHeader = /**
     * Get chunk headers
     * @param {?} offset Chunk offset bytes
     * @param {?} end Chunk end byte
     * @param {?} fileSize File size
     * @param {?=} headers Additional headers
     * @return {?}
     */
    function (offset, end, fileSize, headers) {
        if (headers === void 0) { headers = {}; }
        return new http_1.HttpHeaders(__assign({}, headers, { "Content-Range": "bytes " + offset + " - " + end + " / " + fileSize }));
    };
    /**
     * Calculate upload progress based on the uploaded bytes and total bytes to be transferred.
     *
     * @param {?} uploaded Uploaded bytes
     * @param {?} total Total bytes of files
     * @return {?}
     */
    HttpTransferService.prototype.getProgress = /**
     * Calculate upload progress based on the uploaded bytes and total bytes to be transferred.
     *
     * @param {?} uploaded Uploaded bytes
     * @param {?} total Total bytes of files
     * @return {?}
     */
    function (uploaded, total) {
        return Math.floor(100 * (uploaded / total));
    };
    /**
     * Process single file - chunk it and upload each chunk in sequential order.
     *
     * @param {?} file File to upload
     * @param {?} url Url where file shall be uploaded
     * @param {?=} offset optional Starting byte for upload.
     * @param {?=} headers optional Additional headers that shall be add into the upload request
     * @return {?}
     */
    HttpTransferService.prototype.processFile = /**
     * Process single file - chunk it and upload each chunk in sequential order.
     *
     * @param {?} file File to upload
     * @param {?} url Url where file shall be uploaded
     * @param {?=} offset optional Starting byte for upload.
     * @param {?=} headers optional Additional headers that shall be add into the upload request
     * @return {?}
     */
    function (file, url, offset, headers) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        var /** @type {?} */ chunkSize = this.chunkSize;
        var /** @type {?} */ fileSize = file.size;
        return rxjs_1.Observable.create(function (subscriber) {
            var /** @type {?} */ end;
            var /** @type {?} */ blob;
            var /** @type {?} */ uploadSubscription;
            var /** @type {?} */ readSubscription;
            var /** @type {?} */ reader = new FileReader();
            var /** @type {?} */ readerErrorObservable = rxjs_1.Observable.fromEvent(reader, "error");
            var /** @type {?} */ readerAbortObservable = rxjs_1.Observable.fromEvent(reader, "abort");
            var /** @type {?} */ readerLoadEndObservable = rxjs_1.Observable.fromEvent(reader, "loadend");
            var /** @type {?} */ readNext = function () {
                end = Math.min(offset + chunkSize, file.size);
                blob = file.slice(offset, end);
                reader.readAsArrayBuffer(blob);
            };
            // Complete when fail to read file
            readerErrorObservable.merge(readerAbortObservable).subscribe(function () {
                subscriber.error(reader.error);
            });
            // Upload on read end
            readSubscription = readerLoadEndObservable.subscribe(function () {
                var /** @type {?} */ uploadObservable = _this.uploadChunk(blob, url, _this.getChunkHeader(offset, end, fileSize, headers));
                uploadSubscription = uploadObservable.subscribe(function (event) {
                    if (event.type === http_1.HttpEventType.UploadProgress) {
                        subscriber.next(offset + event.loaded);
                        return;
                    }
                }, function (error) { return subscriber.error(error); }, function () {
                    if (end >= file.size || (subscriber.closed)) {
                        subscriber.complete();
                    }
                    else {
                        offset = end;
                        readNext();
                    }
                });
            });
            readNext();
            // Clean up - unsubscribe from upload and read Observables
            return function () {
                if (uploadSubscription) {
                    uploadSubscription.unsubscribe();
                }
                if (readSubscription) {
                    readSubscription.unsubscribe();
                }
                subscriber.unsubscribe();
            };
        });
    };
    /**
     * Upload single chunk.
     *
     * @param {?} blob
     * @param {?} url
     * @param {?} headers
     * @return {?}
     */
    HttpTransferService.prototype.uploadChunk = /**
     * Upload single chunk.
     *
     * @param {?} blob
     * @param {?} url
     * @param {?} headers
     * @return {?}
     */
    function (blob, url, headers) {
        var /** @type {?} */ request = new http_1.HttpRequest("PUT", url, blob, {
            headers: headers,
            reportProgress: true,
            responseType: RESPONSE_TYPE
        });
        return this.httpClient.request(request)
            .retryWhen(function (error) {
            return error.flatMap(function (error) {
                if (error.status !== 200) {
                    return rxjs_1.Observable.of(error).delay(RETRY_TIMEOUT);
                }
                return rxjs_1.Observable.throw(error.error);
            }).take(CHUNK_UPLOAD_RETRY_COUNT).concat(rxjs_1.Observable.throw({
                error: "Chunk upload error!"
            }));
        });
    };
    Object.defineProperty(HttpTransferService.prototype, "isUploading", {
        /**
         * Flag that indicates weather service is uploading files.
         */
        get: /**
         * Flag that indicates weather service is uploading files.
         * @return {?}
         */
        function () {
            return !!this.runningTasks.size || !!this.uploadTasks.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Uploads 1 or multiple files in chunks.
     * Files are uploaded in parallel based on the service configuration.
     * Chunks are uploaded in sequence.
     */
    /**
     * Uploads 1 or multiple files in chunks.
     * Files are uploaded in parallel based on the service configuration.
     * Chunks are uploaded in sequence.
     * @param {?} headers
     * @param {...?} tasks
     * @return {?}
     */
    HttpTransferService.prototype.upload = /**
     * Uploads 1 or multiple files in chunks.
     * Files are uploaded in parallel based on the service configuration.
     * Chunks are uploaded in sequence.
     * @param {?} headers
     * @param {...?} tasks
     * @return {?}
     */
    function (headers) {
        var _this = this;
        var tasks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            tasks[_i - 1] = arguments[_i];
        }
        var /** @type {?} */ parallel = this.parallelRequests;
        var /** @type {?} */ total = tasks.reduce(function (ac, item) { return (ac + item.file.size); }, 0);
        // Map each task to pair {task, subject}
        // Subject is use to keep track of the progress of its paired task
        this.uploadTasks = this.uploadTasks.concat(tasks.map(function (task) {
            return ({
                task: task,
                subject: new rxjs_1.BehaviorSubject(task.offset || 0)
            });
        }));
        return rxjs_1.Observable.create(function (subscriber) {
            if (!tasks.length) {
                subscriber.complete();
                return;
            }
            // Run next tasks based on the parallelRequests property value
            var /** @type {?} */ runNext = function () {
                var /** @type {?} */ newTasks = _this.uploadTasks.splice(0, (parallel - _this.runningTasks.size));
                // Run new tasks if any
                if (newTasks.length) {
                    newTasks.forEach(function (observableTask) {
                        // Map each task to an observable and
                        // comlete its subject when that observable completes
                        // Map each task to an observable and
                        // comlete its subject when that observable completes
                        rxjs_1.Observable.of(observableTask)
                            .do(function (observableTask) {
                            _this.runningTasks.add(observableTask);
                        })
                            .concatMap(function (observableTask) {
                            var /** @type {?} */ uploadTask = observableTask.task;
                            return _this.processFile(uploadTask.file, uploadTask.url, uploadTask.offset, headers);
                        })
                            .subscribe(function (value) { return observableTask.subject.next(value); }, function (error) {
                            // remove it from the running tasks
                            // remove it from the running tasks
                            _this.runningTasks.delete(observableTask);
                            subscriber.error(error);
                            // do not continue if one of the tasks breaks
                        }, function () {
                            // remove it from the running tasks
                            // remove it from the running tasks
                            _this.runningTasks.delete(observableTask);
                            observableTask.subject.complete();
                            // run next
                            runNext();
                        });
                    });
                }
            };
            var /** @type {?} */ progressSubscription = (_a = rxjs_1.Observable.of(0)).combineLatest.apply(_a, _this.uploadTasks.map(function (task) { return task.subject; }).concat([function (empty) {
                    var progresses = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        progresses[_i - 1] = arguments[_i];
                    }
                    return progresses.reduce(function (start, value) { return (start + value); }, 0);
                }])).subscribe(function (value) { return subscriber.next(value); }, function (error) { return subscriber.error(error); }, function () { return subscriber.complete(); });
            runNext();
            return function () { return progressSubscription.unsubscribe(); };
            var _a;
        })
            .map(function (value) { return _this.getProgress(value, total); });
    };
    HttpTransferService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    HttpTransferService.ctorParameters = function () { return [
        { type: http_1.HttpClient, },
        null,
        null,
    ]; };
    return HttpTransferService;
}());
exports.HttpTransferService = HttpTransferService;
function HttpTransferService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    HttpTransferService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    HttpTransferService.ctorParameters;
    /** @type {?} */
    HttpTransferService.prototype.uploadTasks;
    /** @type {?} */
    HttpTransferService.prototype.runningTasks;
    /** @type {?} */
    HttpTransferService.prototype.httpClient;
    /** @type {?} */
    HttpTransferService.prototype.chunkSize;
    /** @type {?} */
    HttpTransferService.prototype.parallelRequests;
}

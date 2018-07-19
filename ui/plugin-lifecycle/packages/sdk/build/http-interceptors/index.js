"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var logging_interceptor_1 = require("./logging.interceptor");
exports.LoggingInterceptor = logging_interceptor_1.LoggingInterceptor;
var request_headers_interceptor_1 = require("./request.headers.interceptor");
exports.RequestHeadersInterceptor = request_headers_interceptor_1.RequestHeadersInterceptor;
exports.httpInterceptorProviders = [
    { provide: http_1.HTTP_INTERCEPTORS, useClass: logging_interceptor_1.LoggingInterceptor, multi: true },
    { provide: http_1.HTTP_INTERCEPTORS, useClass: request_headers_interceptor_1.RequestHeadersInterceptor, multi: true },
];

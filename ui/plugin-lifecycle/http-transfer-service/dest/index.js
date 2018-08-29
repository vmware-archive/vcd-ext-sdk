"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var http_transfer_service_1 = require("./http-transfer.service");
var http_transfer_service_2 = require("./http-transfer.service");
exports.CHUNK_SIZE = http_transfer_service_2.CHUNK_SIZE;
exports.PARALLEL_REQUESTS = http_transfer_service_2.PARALLEL_REQUESTS;
exports.HttpTransferService = http_transfer_service_2.HttpTransferService;
/**
 * @param {?} httpClient
 * @return {?}
 */
function transferServiceFactory(httpClient) {
    return new http_transfer_service_1.HttpTransferService(httpClient, http_transfer_service_1.CHUNK_SIZE, http_transfer_service_1.PARALLEL_REQUESTS);
}
exports.transferServiceFactory = transferServiceFactory;
var VcdHttpTransferServiceModule = (function () {
    function VcdHttpTransferServiceModule() {
    }
    VcdHttpTransferServiceModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        http_1.HttpClientModule
                    ],
                    declarations: [],
                    exports: [],
                    providers: [{
                            provide: http_transfer_service_1.HttpTransferService,
                            useFactory: transferServiceFactory,
                            deps: [http_1.HttpClient]
                        }]
                },] },
    ];
    /** @nocollapse */
    VcdHttpTransferServiceModule.ctorParameters = function () { return []; };
    return VcdHttpTransferServiceModule;
}());
exports.VcdHttpTransferServiceModule = VcdHttpTransferServiceModule;
function VcdHttpTransferServiceModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    VcdHttpTransferServiceModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    VcdHttpTransferServiceModule.ctorParameters;
}

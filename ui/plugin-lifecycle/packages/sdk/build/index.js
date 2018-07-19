"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var vcd_api_client_1 = require("./vcd.api.client");
var http_interceptors_1 = require("./http-interceptors");
exports.httpInterceptorProviders = http_interceptors_1.httpInterceptorProviders;
var vcd_api_client_2 = require("./vcd.api.client");
exports.VcdApiClient = vcd_api_client_2.VcdApiClient;
var query_1 = require("./query");
exports.Query = query_1.Query;
var api_result_service_1 = require("./api.result.service");
exports.ApiResultService = api_result_service_1.ApiResultService;
exports.ApiResult = api_result_service_1.ApiResult;
var VcdSdkModule = (function () {
    function VcdSdkModule() {
    }
    VcdSdkModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        http_1.HttpClientModule
                    ],
                    declarations: [],
                    exports: [],
                    providers: [vcd_api_client_1.VcdApiClient, http_interceptors_1.httpInterceptorProviders]
                },] },
    ];
    return VcdSdkModule;
}());
exports.VcdSdkModule = VcdSdkModule;
function VcdSdkModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    VcdSdkModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    VcdSdkModule.ctorParameters;
}

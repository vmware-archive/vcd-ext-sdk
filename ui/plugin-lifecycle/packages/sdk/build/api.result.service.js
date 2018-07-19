"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ApiResultService = (function () {
    function ApiResultService() {
        this._results = [];
    }
    Object.defineProperty(ApiResultService.prototype, "results", {
        get: /**
         * @return {?}
         */
        function () {
            return this._results;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} result
     * @return {?}
     */
    ApiResultService.prototype.add = /**
     * @param {?} result
     * @return {?}
     */
    function (result) {
        this._results = [result].concat(this._results.slice(0, 99));
    };
    /**
     * @return {?}
     */
    ApiResultService.prototype.clear = /**
     * @return {?}
     */
    function () {
        this._results = [];
    };
    ApiResultService.decorators = [
        { type: core_1.Injectable },
    ];
    return ApiResultService;
}());
exports.ApiResultService = ApiResultService;
function ApiResultService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ApiResultService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ApiResultService.ctorParameters;
    /** @type {?} */
    ApiResultService.prototype._results;
}
var ApiResult = (function () {
    function ApiResult(message, succeeded, started, finished) {
        this._message = message;
        this._succeeded = succeeded;
        this._started = started;
        this._finished = finished;
    }
    Object.defineProperty(ApiResult.prototype, "message", {
        get: /**
         * @return {?}
         */
        function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiResult.prototype, "succeeded", {
        get: /**
         * @return {?}
         */
        function () {
            return this._succeeded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiResult.prototype, "started", {
        get: /**
         * @return {?}
         */
        function () {
            return this._started;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApiResult.prototype, "finished", {
        get: /**
         * @return {?}
         */
        function () {
            return this._finished;
        },
        enumerable: true,
        configurable: true
    });
    return ApiResult;
}());
exports.ApiResult = ApiResult;
function ApiResult_tsickle_Closure_declarations() {
    /** @type {?} */
    ApiResult.prototype._message;
    /** @type {?} */
    ApiResult.prototype._succeeded;
    /** @type {?} */
    ApiResult.prototype._started;
    /** @type {?} */
    ApiResult.prototype._finished;
}

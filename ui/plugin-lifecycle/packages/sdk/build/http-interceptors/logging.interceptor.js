"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var api_result_service_1 = require("../api.result.service");
var LoggingInterceptor = (function () {
    function LoggingInterceptor(apiResultService) {
        this.apiResultService = apiResultService;
        this._enabled = false;
        this._outputToConsole = !this.apiResultService;
    }
    Object.defineProperty(LoggingInterceptor.prototype, "enabled", {
        set: /**
         * @param {?} enabled
         * @return {?}
         */
        function (enabled) {
            this._enabled = enabled;
            if (this._enabled && this._outputToConsole) {
                console.warn('API logging enabled but no provider found for ApiResultService.  Results will be output to the console.');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    LoggingInterceptor.prototype.intercept = /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    function (req, next) {
        var _this = this;
        if (!this._enabled) {
            return next.handle(req);
        }
        var /** @type {?} */ started = new Date();
        var /** @type {?} */ succeeded;
        return next.handle(req)
            .pipe(operators_1.tap(function (event) { return succeeded = event instanceof http_1.HttpResponse ? true : false; }, function (error) { return succeeded = false; }), operators_1.finalize(function () {
            if (_this._outputToConsole) {
                console.log(req.method + " " + req.urlWithParams + " completed in " + (Date.now() - started.getTime()) + " ms.  Success: " + succeeded);
            }
            else {
                _this.apiResultService.add(new api_result_service_1.ApiResult(req.method + " " + req.urlWithParams, succeeded, started, new Date()));
            }
        }));
    };
    LoggingInterceptor.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    LoggingInterceptor.ctorParameters = function () { return [
        { type: api_result_service_1.ApiResultService, decorators: [{ type: core_1.Optional },] },
    ]; };
    return LoggingInterceptor;
}());
exports.LoggingInterceptor = LoggingInterceptor;
function LoggingInterceptor_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    LoggingInterceptor.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    LoggingInterceptor.ctorParameters;
    /** @type {?} */
    LoggingInterceptor.prototype._outputToConsole;
    /** @type {?} */
    LoggingInterceptor.prototype._enabled;
    /** @type {?} */
    LoggingInterceptor.prototype.apiResultService;
}

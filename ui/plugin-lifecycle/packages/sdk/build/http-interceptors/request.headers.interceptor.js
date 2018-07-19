"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var RequestHeadersInterceptor = (function () {
    function RequestHeadersInterceptor() {
        this._enabled = true;
        this._version = '31.0';
    }
    Object.defineProperty(RequestHeadersInterceptor.prototype, "enabled", {
        set: /**
         * @param {?} _enabled
         * @return {?}
         */
        function (_enabled) {
            this._enabled = _enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestHeadersInterceptor.prototype, "version", {
        set: /**
         * @param {?} _version
         * @return {?}
         */
        function (_version) {
            this._version = _version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestHeadersInterceptor.prototype, "authentication", {
        set: /**
         * @param {?} _authentication
         * @return {?}
         */
        function (_authentication) {
            this._authentication = _authentication;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    RequestHeadersInterceptor.prototype.intercept = /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    function (req, next) {
        var /** @type {?} */ headers = req.headers.set('Accept', "application/*+json;version=" + this._version);
        if (this._authentication) {
            headers = headers.set('Authorization', "" + this._authentication);
        }
        var /** @type {?} */ customReq = req.clone({
            headers: headers
        });
        return next.handle(customReq);
    };
    RequestHeadersInterceptor.decorators = [
        { type: core_1.Injectable },
    ];
    return RequestHeadersInterceptor;
}());
exports.RequestHeadersInterceptor = RequestHeadersInterceptor;
function RequestHeadersInterceptor_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    RequestHeadersInterceptor.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    RequestHeadersInterceptor.ctorParameters;
    /** @type {?} */
    RequestHeadersInterceptor.prototype._enabled;
    /** @type {?} */
    RequestHeadersInterceptor.prototype._version;
    /** @type {?} */
    RequestHeadersInterceptor.prototype._authentication;
}

"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var empty_1 = require("rxjs/observable/empty");
var index_1 = require("./http-interceptors/index");
/**
 * A basic client for interacting with the vCloud Director APIs.
 */
var VcdApiClient = (function () {
    function VcdApiClient(http, injector) {
        this.http = http;
        this.injector = injector;
        this._baseUrl = '';
        this._version = '';
        this.interceptors = injector.get(http_1.HTTP_INTERCEPTORS);
    }
    Object.defineProperty(VcdApiClient.prototype, "baseUrl", {
        set: /**
         * @param {?} _baseUrl
         * @return {?}
         */
        function (_baseUrl) {
            this._baseUrl = _baseUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VcdApiClient.prototype, "version", {
        get: /**
         * @return {?}
         */
        function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} version
     * @return {?}
     */
    VcdApiClient.prototype.setVersion = /**
     * @param {?} version
     * @return {?}
     */
    function (version) {
        this._version = version;
        return this;
    };
    /**
     * Sets the authentication token to use for the VcdApiClient.
     *
     * After setting the token, the client will get the current session
     * information associated with the authenticated token.
     *
     * @param {?} authentication the authentication string (to be used in the 'Authorization' header)
     * @return {?}
     */
    VcdApiClient.prototype.setAuthentication = /**
     * Sets the authentication token to use for the VcdApiClient.
     *
     * After setting the token, the client will get the current session
     * information associated with the authenticated token.
     *
     * @param {?} authentication the authentication string (to be used in the 'Authorization' header)
     * @return {?}
     */
    function (authentication) {
        var _this = this;
        this.setAuthenticationOnInterceptor(authentication);
        return this.http.get(this._baseUrl + "/api/session", { observe: 'response' })
            .pipe(operators_1.catchError(this.handleError), operators_1.map(this.extractSessionType), operators_1.tap(function (session) {
            _this._session = session;
        }));
    };
    /**
     * @return {?}
     */
    VcdApiClient.prototype.enableLogging = /**
     * @return {?}
     */
    function () {
        for (var _i = 0, _a = this.interceptors; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            if (interceptor instanceof index_1.LoggingInterceptor) {
                (/** @type {?} */ (interceptor)).enabled = true;
                break;
            }
        }
        return this;
    };
    /**
     * @param {?} username
     * @param {?} tenant
     * @param {?} password
     * @return {?}
     */
    VcdApiClient.prototype.login = /**
     * @param {?} username
     * @param {?} tenant
     * @param {?} password
     * @return {?}
     */
    function (username, tenant, password) {
        var _this = this;
        var /** @type {?} */ authString = btoa(username + "@" + tenant + ":" + password);
        return this.http.post(this._baseUrl + "/api/sessions", null, { observe: 'response', headers: new http_1.HttpHeaders({ 'Authorization': "Basic " + authString }) })
            .pipe(operators_1.catchError(this.handleError), operators_1.tap(function (response) {
            return _this.setAuthenticationOnInterceptor(response.headers.get('x-vmware-vcloud-token-type') + " " + response.headers.get('x-vmware-vcloud-access-token'));
        }), operators_1.map(this.extractSessionType), operators_1.tap(function (session) {
            _this._session = session;
        }));
    };
    /**
     * @template T
     * @param {?} builder
     * @return {?}
     */
    VcdApiClient.prototype.query = /**
     * @template T
     * @param {?} builder
     * @return {?}
     */
    function (builder) {
        return this.http.get(this._baseUrl + "/api/query" + builder.get())
            .pipe(operators_1.catchError(this.handleError));
    };
    Object.defineProperty(VcdApiClient.prototype, "username", {
        get: /**
         * @return {?}
         */
        function () {
            return this._session.user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VcdApiClient.prototype, "organization", {
        get: /**
         * @return {?}
         */
        function () {
            return this._session.org;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} authentication
     * @return {?}
     */
    VcdApiClient.prototype.setAuthenticationOnInterceptor = /**
     * @param {?} authentication
     * @return {?}
     */
    function (authentication) {
        for (var _i = 0, _a = this.interceptors; _i < _a.length; _i++) {
            var interceptor = _a[_i];
            if (interceptor instanceof index_1.RequestHeadersInterceptor) {
                (/** @type {?} */ (interceptor)).authentication = authentication;
                break;
            }
        }
    };
    /**
     * @param {?} response
     * @return {?}
     */
    VcdApiClient.prototype.extractSessionType = /**
     * @param {?} response
     * @return {?}
     */
    function (response) {
        if (response.body.value) {
            return /** @type {?} */ (response.body.value);
        }
        else {
            return /** @type {?} */ (response.body);
        }
    };
    /**
     * @template T
     * @param {?} response
     * @return {?}
     */
    VcdApiClient.prototype.handleError = /**
     * @template T
     * @param {?} response
     * @return {?}
     */
    function (response) {
        var /** @type {?} */ error = new DOMParser().parseFromString(response.error, 'text/xml').getElementsByTagName('Error')[0];
        console.error("Error occurred communicating with server:\n            message: " + error.getAttribute('message') + "\n            request id: " + response.headers.get('x-vmware-vcloud-request-id') + "\n        ");
        return empty_1.empty();
    };
    VcdApiClient.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    VcdApiClient.ctorParameters = function () { return [
        { type: http_1.HttpClient, },
        { type: core_1.Injector, },
    ]; };
    return VcdApiClient;
}());
exports.VcdApiClient = VcdApiClient;
function VcdApiClient_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    VcdApiClient.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    VcdApiClient.ctorParameters;
    /** @type {?} */
    VcdApiClient.prototype._baseUrl;
    /** @type {?} */
    VcdApiClient.prototype._version;
    /** @type {?} */
    VcdApiClient.prototype.interceptors;
    /** @type {?} */
    VcdApiClient.prototype._session;
    /** @type {?} */
    VcdApiClient.prototype.http;
    /** @type {?} */
    VcdApiClient.prototype.injector;
}

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NetworkServiceType_1 = require("./NetworkServiceType");
var GatewayIpsecVpnServiceType = (function (_super) {
    __extends(GatewayIpsecVpnServiceType, _super);
    function GatewayIpsecVpnServiceType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GatewayIpsecVpnServiceType;
}(NetworkServiceType_1.NetworkServiceType));
exports.GatewayIpsecVpnServiceType = GatewayIpsecVpnServiceType;
(function (GatewayIpsecVpnServiceType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(NetworkServiceType_1.NetworkServiceType.Fields));
    GatewayIpsecVpnServiceType.Fields = Fields;
})(GatewayIpsecVpnServiceType = exports.GatewayIpsecVpnServiceType || (exports.GatewayIpsecVpnServiceType = {}));
exports.GatewayIpsecVpnServiceType = GatewayIpsecVpnServiceType;

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
var DhcpServiceType = (function (_super) {
    __extends(DhcpServiceType, _super);
    function DhcpServiceType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DhcpServiceType;
}(NetworkServiceType_1.NetworkServiceType));
exports.DhcpServiceType = DhcpServiceType;
(function (DhcpServiceType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(NetworkServiceType_1.NetworkServiceType.Fields));
    DhcpServiceType.Fields = Fields;
})(DhcpServiceType = exports.DhcpServiceType || (exports.DhcpServiceType = {}));
exports.DhcpServiceType = DhcpServiceType;

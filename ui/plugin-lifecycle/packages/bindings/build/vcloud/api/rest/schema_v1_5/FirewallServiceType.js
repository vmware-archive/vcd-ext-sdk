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
var FirewallServiceType = (function (_super) {
    __extends(FirewallServiceType, _super);
    function FirewallServiceType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FirewallServiceType;
}(NetworkServiceType_1.NetworkServiceType));
exports.FirewallServiceType = FirewallServiceType;
(function (FirewallServiceType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(NetworkServiceType_1.NetworkServiceType.Fields));
    FirewallServiceType.Fields = Fields;
})(FirewallServiceType = exports.FirewallServiceType || (exports.FirewallServiceType = {}));
exports.FirewallServiceType = FirewallServiceType;

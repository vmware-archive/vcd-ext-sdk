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
var LoadBalancerServiceType = (function (_super) {
    __extends(LoadBalancerServiceType, _super);
    function LoadBalancerServiceType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LoadBalancerServiceType;
}(NetworkServiceType_1.NetworkServiceType));
exports.LoadBalancerServiceType = LoadBalancerServiceType;
(function (LoadBalancerServiceType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(NetworkServiceType_1.NetworkServiceType.Fields));
    LoadBalancerServiceType.Fields = Fields;
})(LoadBalancerServiceType = exports.LoadBalancerServiceType || (exports.LoadBalancerServiceType = {}));
exports.LoadBalancerServiceType = LoadBalancerServiceType;

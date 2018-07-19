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
var ResourceType_1 = require("./ResourceType");
var AllocatedIpAddressesType = (function (_super) {
    __extends(AllocatedIpAddressesType, _super);
    function AllocatedIpAddressesType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AllocatedIpAddressesType;
}(ResourceType_1.ResourceType));
exports.AllocatedIpAddressesType = AllocatedIpAddressesType;
(function (AllocatedIpAddressesType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(ResourceType_1.ResourceType.Fields));
    AllocatedIpAddressesType.Fields = Fields;
})(AllocatedIpAddressesType = exports.AllocatedIpAddressesType || (exports.AllocatedIpAddressesType = {}));
exports.AllocatedIpAddressesType = AllocatedIpAddressesType;

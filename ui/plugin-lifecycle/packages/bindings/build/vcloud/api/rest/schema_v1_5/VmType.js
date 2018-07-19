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
var AbstractVAppType_1 = require("./AbstractVAppType");
var VmType = (function (_super) {
    __extends(VmType, _super);
    function VmType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VmType;
}(AbstractVAppType_1.AbstractVAppType));
exports.VmType = VmType;
(function (VmType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(AbstractVAppType_1.AbstractVAppType.Fields));
    VmType.Fields = Fields;
})(VmType = exports.VmType || (exports.VmType = {}));
exports.VmType = VmType;

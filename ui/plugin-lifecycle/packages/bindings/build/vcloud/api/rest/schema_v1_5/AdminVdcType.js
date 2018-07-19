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
var VdcType_1 = require("./VdcType");
var AdminVdcType = (function (_super) {
    __extends(AdminVdcType, _super);
    function AdminVdcType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AdminVdcType;
}(VdcType_1.VdcType));
exports.AdminVdcType = AdminVdcType;
(function (AdminVdcType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(VdcType_1.VdcType.Fields));
    AdminVdcType.Fields = Fields;
})(AdminVdcType = exports.AdminVdcType || (exports.AdminVdcType = {}));
exports.AdminVdcType = AdminVdcType;

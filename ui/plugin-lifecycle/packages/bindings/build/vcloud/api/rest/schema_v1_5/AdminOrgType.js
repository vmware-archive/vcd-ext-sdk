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
var OrgType_1 = require("./OrgType");
var AdminOrgType = (function (_super) {
    __extends(AdminOrgType, _super);
    function AdminOrgType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AdminOrgType;
}(OrgType_1.OrgType));
exports.AdminOrgType = AdminOrgType;
(function (AdminOrgType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(OrgType_1.OrgType.Fields));
    AdminOrgType.Fields = Fields;
})(AdminOrgType = exports.AdminOrgType || (exports.AdminOrgType = {}));
exports.AdminOrgType = AdminOrgType;

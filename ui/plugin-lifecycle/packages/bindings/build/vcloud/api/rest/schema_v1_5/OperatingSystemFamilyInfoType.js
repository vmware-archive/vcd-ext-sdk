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
var VCloudExtensibleType_1 = require("./VCloudExtensibleType");
var OperatingSystemFamilyInfoType = (function (_super) {
    __extends(OperatingSystemFamilyInfoType, _super);
    function OperatingSystemFamilyInfoType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OperatingSystemFamilyInfoType;
}(VCloudExtensibleType_1.VCloudExtensibleType));
exports.OperatingSystemFamilyInfoType = OperatingSystemFamilyInfoType;
(function (OperatingSystemFamilyInfoType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(VCloudExtensibleType_1.VCloudExtensibleType.Fields));
    OperatingSystemFamilyInfoType.Fields = Fields;
})(OperatingSystemFamilyInfoType = exports.OperatingSystemFamilyInfoType || (exports.OperatingSystemFamilyInfoType = {}));
exports.OperatingSystemFamilyInfoType = OperatingSystemFamilyInfoType;

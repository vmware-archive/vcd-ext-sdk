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
var ComputeResourceType = (function (_super) {
    __extends(ComputeResourceType, _super);
    function ComputeResourceType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ComputeResourceType;
}(VCloudExtensibleType_1.VCloudExtensibleType));
exports.ComputeResourceType = ComputeResourceType;
(function (ComputeResourceType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(VCloudExtensibleType_1.VCloudExtensibleType.Fields));
    ComputeResourceType.Fields = Fields;
})(ComputeResourceType = exports.ComputeResourceType || (exports.ComputeResourceType = {}));
exports.ComputeResourceType = ComputeResourceType;

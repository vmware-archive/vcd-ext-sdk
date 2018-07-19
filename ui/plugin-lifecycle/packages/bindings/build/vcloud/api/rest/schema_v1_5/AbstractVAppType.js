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
var ResourceEntityType_1 = require("./ResourceEntityType");
var AbstractVAppType = (function (_super) {
    __extends(AbstractVAppType, _super);
    function AbstractVAppType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AbstractVAppType;
}(ResourceEntityType_1.ResourceEntityType));
exports.AbstractVAppType = AbstractVAppType;
(function (AbstractVAppType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(ResourceEntityType_1.ResourceEntityType.Fields));
    AbstractVAppType.Fields = Fields;
})(AbstractVAppType = exports.AbstractVAppType || (exports.AbstractVAppType = {}));
exports.AbstractVAppType = AbstractVAppType;

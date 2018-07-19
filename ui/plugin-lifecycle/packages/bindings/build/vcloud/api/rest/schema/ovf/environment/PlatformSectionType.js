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
var SectionType_1 = require("./SectionType");
var PlatformSectionType = (function (_super) {
    __extends(PlatformSectionType, _super);
    function PlatformSectionType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PlatformSectionType;
}(SectionType_1.SectionType));
exports.PlatformSectionType = PlatformSectionType;
(function (PlatformSectionType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(SectionType_1.SectionType.Fields));
    PlatformSectionType.Fields = Fields;
})(PlatformSectionType = exports.PlatformSectionType || (exports.PlatformSectionType = {}));
exports.PlatformSectionType = PlatformSectionType;

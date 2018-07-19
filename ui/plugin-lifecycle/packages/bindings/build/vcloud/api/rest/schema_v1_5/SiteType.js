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
var MultisiteType_1 = require("./MultisiteType");
var SiteType = (function (_super) {
    __extends(SiteType, _super);
    function SiteType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SiteType;
}(MultisiteType_1.MultisiteType));
exports.SiteType = SiteType;
(function (SiteType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(MultisiteType_1.MultisiteType.Fields));
    SiteType.Fields = Fields;
})(SiteType = exports.SiteType || (exports.SiteType = {}));
exports.SiteType = SiteType;

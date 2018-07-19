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
var SiteAssociationsType = (function (_super) {
    __extends(SiteAssociationsType, _super);
    function SiteAssociationsType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SiteAssociationsType;
}(ResourceType_1.ResourceType));
exports.SiteAssociationsType = SiteAssociationsType;
(function (SiteAssociationsType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(ResourceType_1.ResourceType.Fields));
    SiteAssociationsType.Fields = Fields;
})(SiteAssociationsType = exports.SiteAssociationsType || (exports.SiteAssociationsType = {}));
exports.SiteAssociationsType = SiteAssociationsType;

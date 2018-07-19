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
var SelectorExtensionsType = (function (_super) {
    __extends(SelectorExtensionsType, _super);
    function SelectorExtensionsType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SelectorExtensionsType;
}(ResourceType_1.ResourceType));
exports.SelectorExtensionsType = SelectorExtensionsType;
(function (SelectorExtensionsType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(ResourceType_1.ResourceType.Fields));
    SelectorExtensionsType.Fields = Fields;
})(SelectorExtensionsType = exports.SelectorExtensionsType || (exports.SelectorExtensionsType = {}));
exports.SelectorExtensionsType = SelectorExtensionsType;

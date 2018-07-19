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
var EntityType_1 = require("./EntityType");
var ApiDefinitionType = (function (_super) {
    __extends(ApiDefinitionType, _super);
    function ApiDefinitionType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ApiDefinitionType;
}(EntityType_1.EntityType));
exports.ApiDefinitionType = ApiDefinitionType;
(function (ApiDefinitionType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(EntityType_1.EntityType.Fields));
    ApiDefinitionType.Fields = Fields;
})(ApiDefinitionType = exports.ApiDefinitionType || (exports.ApiDefinitionType = {}));
exports.ApiDefinitionType = ApiDefinitionType;

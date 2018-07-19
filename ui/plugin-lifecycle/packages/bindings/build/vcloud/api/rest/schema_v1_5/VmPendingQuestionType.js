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
var VmPendingQuestionType = (function (_super) {
    __extends(VmPendingQuestionType, _super);
    function VmPendingQuestionType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VmPendingQuestionType;
}(ResourceType_1.ResourceType));
exports.VmPendingQuestionType = VmPendingQuestionType;
(function (VmPendingQuestionType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(ResourceType_1.ResourceType.Fields));
    VmPendingQuestionType.Fields = Fields;
})(VmPendingQuestionType = exports.VmPendingQuestionType || (exports.VmPendingQuestionType = {}));
exports.VmPendingQuestionType = VmPendingQuestionType;

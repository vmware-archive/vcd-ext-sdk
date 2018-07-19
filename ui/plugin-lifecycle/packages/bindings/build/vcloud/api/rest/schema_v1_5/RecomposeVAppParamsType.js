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
var ComposeVAppParamsType_1 = require("./ComposeVAppParamsType");
var RecomposeVAppParamsType = (function (_super) {
    __extends(RecomposeVAppParamsType, _super);
    function RecomposeVAppParamsType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RecomposeVAppParamsType;
}(ComposeVAppParamsType_1.ComposeVAppParamsType));
exports.RecomposeVAppParamsType = RecomposeVAppParamsType;
(function (RecomposeVAppParamsType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(ComposeVAppParamsType_1.ComposeVAppParamsType.Fields));
    RecomposeVAppParamsType.Fields = Fields;
})(RecomposeVAppParamsType = exports.RecomposeVAppParamsType || (exports.RecomposeVAppParamsType = {}));
exports.RecomposeVAppParamsType = RecomposeVAppParamsType;

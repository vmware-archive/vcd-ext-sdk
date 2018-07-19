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
var HistoricUsageType = (function (_super) {
    __extends(HistoricUsageType, _super);
    function HistoricUsageType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HistoricUsageType;
}(ResourceType_1.ResourceType));
exports.HistoricUsageType = HistoricUsageType;
(function (HistoricUsageType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(ResourceType_1.ResourceType.Fields));
    HistoricUsageType.Fields = Fields;
})(HistoricUsageType = exports.HistoricUsageType || (exports.HistoricUsageType = {}));
exports.HistoricUsageType = HistoricUsageType;

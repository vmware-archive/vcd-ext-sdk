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
/*
 * Copyright (c) 2018 VMware, Inc. All rights reserved.
 */
var SectionType_1 = require("./../SectionType");
var CpuCompatibilitySectionType = (function (_super) {
    __extends(CpuCompatibilitySectionType, _super);
    function CpuCompatibilitySectionType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CpuCompatibilitySectionType;
}(SectionType_1.SectionType));
exports.CpuCompatibilitySectionType = CpuCompatibilitySectionType;
(function (CpuCompatibilitySectionType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(SectionType_1.SectionType.Fields));
    CpuCompatibilitySectionType.Fields = Fields;
})(CpuCompatibilitySectionType = exports.CpuCompatibilitySectionType || (exports.CpuCompatibilitySectionType = {}));
exports.CpuCompatibilitySectionType = CpuCompatibilitySectionType;

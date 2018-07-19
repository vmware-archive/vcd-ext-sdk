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
var AffinityRuleType_1 = require("./AffinityRuleType");
var VmAffinityRuleType = (function (_super) {
    __extends(VmAffinityRuleType, _super);
    function VmAffinityRuleType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VmAffinityRuleType;
}(AffinityRuleType_1.AffinityRuleType));
exports.VmAffinityRuleType = VmAffinityRuleType;
(function (VmAffinityRuleType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(AffinityRuleType_1.AffinityRuleType.Fields));
    VmAffinityRuleType.Fields = Fields;
})(VmAffinityRuleType = exports.VmAffinityRuleType || (exports.VmAffinityRuleType = {}));
exports.VmAffinityRuleType = VmAffinityRuleType;

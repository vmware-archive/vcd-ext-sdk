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
var VAppCreationParamsType_1 = require("./VAppCreationParamsType");
var ComposeVAppParamsType = (function (_super) {
    __extends(ComposeVAppParamsType, _super);
    function ComposeVAppParamsType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ComposeVAppParamsType;
}(VAppCreationParamsType_1.VAppCreationParamsType));
exports.ComposeVAppParamsType = ComposeVAppParamsType;
(function (ComposeVAppParamsType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(VAppCreationParamsType_1.VAppCreationParamsType.Fields));
    ComposeVAppParamsType.Fields = Fields;
})(ComposeVAppParamsType = exports.ComposeVAppParamsType || (exports.ComposeVAppParamsType = {}));
exports.ComposeVAppParamsType = ComposeVAppParamsType;

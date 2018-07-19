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
var VimObjectRefType_1 = require("./VimObjectRefType");
var VmObjectRefType = (function (_super) {
    __extends(VmObjectRefType, _super);
    function VmObjectRefType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VmObjectRefType;
}(VimObjectRefType_1.VimObjectRefType));
exports.VmObjectRefType = VmObjectRefType;
(function (VmObjectRefType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(VimObjectRefType_1.VimObjectRefType.Fields));
    VmObjectRefType.Fields = Fields;
})(VmObjectRefType = exports.VmObjectRefType || (exports.VmObjectRefType = {}));
exports.VmObjectRefType = VmObjectRefType;

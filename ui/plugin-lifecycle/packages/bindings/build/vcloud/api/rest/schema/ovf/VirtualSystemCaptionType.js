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
var CimString_1 = require("./CimString");
var VirtualSystemCaptionType = (function (_super) {
    __extends(VirtualSystemCaptionType, _super);
    function VirtualSystemCaptionType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VirtualSystemCaptionType;
}(CimString_1.CimString));
exports.VirtualSystemCaptionType = VirtualSystemCaptionType;
(function (VirtualSystemCaptionType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(CimString_1.CimString.Fields));
    VirtualSystemCaptionType.Fields = Fields;
})(VirtualSystemCaptionType = exports.VirtualSystemCaptionType || (exports.VirtualSystemCaptionType = {}));
exports.VirtualSystemCaptionType = VirtualSystemCaptionType;

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
var NetworkType_1 = require("./NetworkType");
var VAppNetworkType = (function (_super) {
    __extends(VAppNetworkType, _super);
    function VAppNetworkType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VAppNetworkType;
}(NetworkType_1.NetworkType));
exports.VAppNetworkType = VAppNetworkType;
(function (VAppNetworkType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(NetworkType_1.NetworkType.Fields));
    VAppNetworkType.Fields = Fields;
})(VAppNetworkType = exports.VAppNetworkType || (exports.VAppNetworkType = {}));
exports.VAppNetworkType = VAppNetworkType;

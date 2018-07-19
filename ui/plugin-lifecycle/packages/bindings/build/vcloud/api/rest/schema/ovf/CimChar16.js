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
var CimChar16 = (function (_super) {
    __extends(CimChar16, _super);
    function CimChar16() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CimChar16;
}(CimString_1.CimString));
exports.CimChar16 = CimChar16;
(function (CimChar16) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(CimString_1.CimString.Fields));
    CimChar16.Fields = Fields;
})(CimChar16 = exports.CimChar16 || (exports.CimChar16 = {}));
exports.CimChar16 = CimChar16;

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
var CimLong_1 = require("./CimLong");
var QualifierSInt64 = (function (_super) {
    __extends(QualifierSInt64, _super);
    function QualifierSInt64() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QualifierSInt64;
}(CimLong_1.CimLong));
exports.QualifierSInt64 = QualifierSInt64;
(function (QualifierSInt64) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(CimLong_1.CimLong.Fields));
    QualifierSInt64.Fields = Fields;
})(QualifierSInt64 = exports.QualifierSInt64 || (exports.QualifierSInt64 = {}));
exports.QualifierSInt64 = QualifierSInt64;

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
var CimUnsignedInt_1 = require("./CimUnsignedInt");
var QualifierUInt32 = (function (_super) {
    __extends(QualifierUInt32, _super);
    function QualifierUInt32() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return QualifierUInt32;
}(CimUnsignedInt_1.CimUnsignedInt));
exports.QualifierUInt32 = QualifierUInt32;
(function (QualifierUInt32) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(CimUnsignedInt_1.CimUnsignedInt.Fields));
    QualifierUInt32.Fields = Fields;
})(QualifierUInt32 = exports.QualifierUInt32 || (exports.QualifierUInt32 = {}));
exports.QualifierUInt32 = QualifierUInt32;

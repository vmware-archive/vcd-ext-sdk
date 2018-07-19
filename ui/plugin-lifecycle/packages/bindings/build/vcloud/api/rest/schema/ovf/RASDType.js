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
var CIMResourceAllocationSettingDataType_1 = require("./CIMResourceAllocationSettingDataType");
var RASDType = (function (_super) {
    __extends(RASDType, _super);
    function RASDType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RASDType;
}(CIMResourceAllocationSettingDataType_1.CIMResourceAllocationSettingDataType));
exports.RASDType = RASDType;
(function (RASDType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(CIMResourceAllocationSettingDataType_1.CIMResourceAllocationSettingDataType.Fields));
    RASDType.Fields = Fields;
})(RASDType = exports.RASDType || (exports.RASDType = {}));
exports.RASDType = RASDType;

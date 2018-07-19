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
var VMWVdcTemplateSpecificationType_1 = require("./VMWVdcTemplateSpecificationType");
var VMWReservationPoolVdcTemplateSpecificationType = (function (_super) {
    __extends(VMWReservationPoolVdcTemplateSpecificationType, _super);
    function VMWReservationPoolVdcTemplateSpecificationType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VMWReservationPoolVdcTemplateSpecificationType;
}(VMWVdcTemplateSpecificationType_1.VMWVdcTemplateSpecificationType));
exports.VMWReservationPoolVdcTemplateSpecificationType = VMWReservationPoolVdcTemplateSpecificationType;
(function (VMWReservationPoolVdcTemplateSpecificationType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(VMWVdcTemplateSpecificationType_1.VMWVdcTemplateSpecificationType.Fields));
    VMWReservationPoolVdcTemplateSpecificationType.Fields = Fields;
})(VMWReservationPoolVdcTemplateSpecificationType = exports.VMWReservationPoolVdcTemplateSpecificationType || (exports.VMWReservationPoolVdcTemplateSpecificationType = {}));
exports.VMWReservationPoolVdcTemplateSpecificationType = VMWReservationPoolVdcTemplateSpecificationType;

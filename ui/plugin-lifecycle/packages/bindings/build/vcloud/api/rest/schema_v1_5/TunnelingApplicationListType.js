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
var ContainerType_1 = require("./ContainerType");
var TunnelingApplicationListType = (function (_super) {
    __extends(TunnelingApplicationListType, _super);
    function TunnelingApplicationListType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TunnelingApplicationListType;
}(ContainerType_1.ContainerType));
exports.TunnelingApplicationListType = TunnelingApplicationListType;
(function (TunnelingApplicationListType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(ContainerType_1.ContainerType.Fields));
    TunnelingApplicationListType.Fields = Fields;
})(TunnelingApplicationListType = exports.TunnelingApplicationListType || (exports.TunnelingApplicationListType = {}));
exports.TunnelingApplicationListType = TunnelingApplicationListType;

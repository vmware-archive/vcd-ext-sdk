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
var IpsecVpnManagedPeerType_1 = require("./IpsecVpnManagedPeerType");
var IpsecVpnLocalPeerType = (function (_super) {
    __extends(IpsecVpnLocalPeerType, _super);
    function IpsecVpnLocalPeerType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return IpsecVpnLocalPeerType;
}(IpsecVpnManagedPeerType_1.IpsecVpnManagedPeerType));
exports.IpsecVpnLocalPeerType = IpsecVpnLocalPeerType;
(function (IpsecVpnLocalPeerType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(IpsecVpnManagedPeerType_1.IpsecVpnManagedPeerType.Fields));
    IpsecVpnLocalPeerType.Fields = Fields;
})(IpsecVpnLocalPeerType = exports.IpsecVpnLocalPeerType || (exports.IpsecVpnLocalPeerType = {}));
exports.IpsecVpnLocalPeerType = IpsecVpnLocalPeerType;

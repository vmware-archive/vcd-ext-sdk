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
var IpsecVpnPeerType_1 = require("./IpsecVpnPeerType");
var IpsecVpnManagedPeerType = (function (_super) {
    __extends(IpsecVpnManagedPeerType, _super);
    function IpsecVpnManagedPeerType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return IpsecVpnManagedPeerType;
}(IpsecVpnPeerType_1.IpsecVpnPeerType));
exports.IpsecVpnManagedPeerType = IpsecVpnManagedPeerType;
(function (IpsecVpnManagedPeerType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(IpsecVpnPeerType_1.IpsecVpnPeerType.Fields));
    IpsecVpnManagedPeerType.Fields = Fields;
})(IpsecVpnManagedPeerType = exports.IpsecVpnManagedPeerType || (exports.IpsecVpnManagedPeerType = {}));
exports.IpsecVpnManagedPeerType = IpsecVpnManagedPeerType;

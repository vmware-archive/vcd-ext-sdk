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
var Configuration_1 = require("./Configuration");
var DeploymentOptionSectionConfiguration = (function (_super) {
    __extends(DeploymentOptionSectionConfiguration, _super);
    function DeploymentOptionSectionConfiguration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DeploymentOptionSectionConfiguration;
}(Configuration_1.Configuration));
exports.DeploymentOptionSectionConfiguration = DeploymentOptionSectionConfiguration;
(function (DeploymentOptionSectionConfiguration) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(Configuration_1.Configuration.Fields));
    DeploymentOptionSectionConfiguration.Fields = Fields;
})(DeploymentOptionSectionConfiguration = exports.DeploymentOptionSectionConfiguration || (exports.DeploymentOptionSectionConfiguration = {}));
exports.DeploymentOptionSectionConfiguration = DeploymentOptionSectionConfiguration;

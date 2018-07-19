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
var BlockingTaskOperationParamsType_1 = require("./BlockingTaskOperationParamsType");
var BlockingTaskUpdateProgressParamsType = (function (_super) {
    __extends(BlockingTaskUpdateProgressParamsType, _super);
    function BlockingTaskUpdateProgressParamsType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BlockingTaskUpdateProgressParamsType;
}(BlockingTaskOperationParamsType_1.BlockingTaskOperationParamsType));
exports.BlockingTaskUpdateProgressParamsType = BlockingTaskUpdateProgressParamsType;
(function (BlockingTaskUpdateProgressParamsType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(BlockingTaskOperationParamsType_1.BlockingTaskOperationParamsType.Fields));
    BlockingTaskUpdateProgressParamsType.Fields = Fields;
})(BlockingTaskUpdateProgressParamsType = exports.BlockingTaskUpdateProgressParamsType || (exports.BlockingTaskUpdateProgressParamsType = {}));
exports.BlockingTaskUpdateProgressParamsType = BlockingTaskUpdateProgressParamsType;

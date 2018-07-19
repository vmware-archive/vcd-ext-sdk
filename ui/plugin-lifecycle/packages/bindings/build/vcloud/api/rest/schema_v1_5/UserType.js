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
var EntityType_1 = require("./EntityType");
var UserType = (function (_super) {
    __extends(UserType, _super);
    function UserType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UserType;
}(EntityType_1.EntityType));
exports.UserType = UserType;
(function (UserType) {
    var Fields = (function (_super) {
        __extends(Fields, _super);
        function Fields() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fields;
    }(EntityType_1.EntityType.Fields));
    UserType.Fields = Fields;
})(UserType = exports.UserType || (exports.UserType = {}));
exports.UserType = UserType;

"use strict";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Query;
(function (Query) {
    var Builder = (function () {
        function Builder() {
            this._format = Format.ID_RECORDS;
            this._links = true;
            this._pageSize = 25;
        }
        /**
         * @param {?} type
         * @return {?}
         */
        Builder.ofType = /**
         * @param {?} type
         * @return {?}
         */
        function (type) {
            var /** @type {?} */ qb = new Builder();
            qb._type = type;
            return qb;
        };
        /**
         * @param {?} format
         * @return {?}
         */
        Builder.prototype.format = /**
         * @param {?} format
         * @return {?}
         */
        function (format) {
            this._format = format;
            return this;
        };
        /**
         * @param {?} links
         * @return {?}
         */
        Builder.prototype.links = /**
         * @param {?} links
         * @return {?}
         */
        function (links) {
            this._links = links;
            return this;
        };
        /**
         * @param {?} pageSize
         * @return {?}
         */
        Builder.prototype.pageSize = /**
         * @param {?} pageSize
         * @return {?}
         */
        function (pageSize) {
            this._pageSize = pageSize;
            return this;
        };
        /**
         * @return {?}
         */
        Builder.prototype.get = /**
         * @return {?}
         */
        function () {
            var /** @type {?} */ query = "?type=" + this._type + "&format=" + this._format + "&links=" + this._links + "&pageSize=" + this._pageSize;
            return query;
        };
        return Builder;
    }());
    Query.Builder = Builder;
    function Builder_tsickle_Closure_declarations() {
        /** @type {?} */
        Builder.prototype._type;
        /** @type {?} */
        Builder.prototype._format;
        /** @type {?} */
        Builder.prototype._links;
        /** @type {?} */
        Builder.prototype._pageSize;
    }
    var Format = (function () {
        function Format() {
        }
        Format.ID_RECORDS = 'idrecords';
        Format.RECORDS = 'records';
        Format.REFERENCES = 'references';
        return Format;
    }());
    Query.Format = Format;
    function Format_tsickle_Closure_declarations() {
        /** @type {?} */
        Format.ID_RECORDS;
        /** @type {?} */
        Format.RECORDS;
        /** @type {?} */
        Format.REFERENCES;
    }
})(Query = exports.Query || (exports.Query = {}));

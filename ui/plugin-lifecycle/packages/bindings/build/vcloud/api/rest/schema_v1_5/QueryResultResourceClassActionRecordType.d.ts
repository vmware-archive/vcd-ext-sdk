import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultResourceClassActionRecordType extends QueryResultRecordType {
    httpMethod?: string;
    name?: string;
    resourceClass?: string;
    urlPattern?: string;
}
export declare namespace QueryResultResourceClassActionRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly HTTP_METHOD: "httpMethod";
        static readonly NAME: "name";
        static readonly RESOURCE_CLASS: "resourceClass";
        static readonly URL_PATTERN: "urlPattern";
    }
}

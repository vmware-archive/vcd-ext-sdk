import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultApiFilterRecordType extends QueryResultRecordType {
    service?: string;
    urlPattern?: string;
}
export declare namespace QueryResultApiFilterRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly SERVICE: "service";
        static readonly URL_PATTERN: "urlPattern";
    }
}

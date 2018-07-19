import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultResourceClassRecordType extends QueryResultRecordType {
    mimeType?: string;
    name?: string;
    nid?: string;
    service?: string;
    urlTemplate?: string;
    urnPattern?: string;
}
export declare namespace QueryResultResourceClassRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly MIME_TYPE: "mimeType";
        static readonly NAME: "name";
        static readonly NID: "nid";
        static readonly SERVICE: "service";
        static readonly URL_TEMPLATE: "urlTemplate";
        static readonly URN_PATTERN: "urnPattern";
    }
}

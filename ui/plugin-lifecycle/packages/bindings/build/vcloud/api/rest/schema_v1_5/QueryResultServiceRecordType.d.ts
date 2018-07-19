import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultServiceRecordType extends QueryResultRecordType {
    name?: string;
    namespace?: string;
    vendor?: string;
}
export declare namespace QueryResultServiceRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly NAME: "name";
        static readonly NAMESPACE: "namespace";
        static readonly VENDOR: "vendor";
    }
}

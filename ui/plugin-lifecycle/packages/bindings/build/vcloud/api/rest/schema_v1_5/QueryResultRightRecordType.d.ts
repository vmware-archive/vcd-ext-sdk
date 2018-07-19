import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultRightRecordType extends QueryResultRecordType {
    category?: string;
    name?: string;
}
export declare namespace QueryResultRightRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CATEGORY: "category";
        static readonly NAME: "name";
    }
}

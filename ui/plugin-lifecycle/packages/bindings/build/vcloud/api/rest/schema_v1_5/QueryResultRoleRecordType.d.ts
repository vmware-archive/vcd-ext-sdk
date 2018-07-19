import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultRoleRecordType extends QueryResultRecordType {
    isReadOnly?: boolean;
    name?: string;
}
export declare namespace QueryResultRoleRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IS_READ_ONLY: "isReadOnly";
        static readonly NAME: "name";
    }
}

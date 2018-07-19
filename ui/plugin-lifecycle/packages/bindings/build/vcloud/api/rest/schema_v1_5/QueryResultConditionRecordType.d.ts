import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultConditionRecordType extends QueryResultRecordType {
    details?: string;
    object?: string;
    objectType?: string;
    occurenceDate?: Date;
    severity?: string;
    summary?: string;
}
export declare namespace QueryResultConditionRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DETAILS: "details";
        static readonly OBJECT: "object";
        static readonly OBJECT_TYPE: "objectType";
        static readonly OCCURENCE_DATE: "occurenceDate";
        static readonly SEVERITY: "severity";
        static readonly SUMMARY: "summary";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminRoleRecordType extends QueryResultRecordType {
    isReadOnly?: boolean;
    name?: string;
    org?: string;
    orgName?: string;
}
export declare namespace QueryResultAdminRoleRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IS_READ_ONLY: "isReadOnly";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly ORG_NAME: "orgName";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultStrandedUserRecordType extends QueryResultRecordType {
    fullName?: string;
    isInSync?: boolean;
    name?: string;
    numberOfDeployedVMs?: number;
    numberOfStoredVMs?: number;
    org?: string;
}
export declare namespace QueryResultStrandedUserRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly FULL_NAME: "fullName";
        static readonly IS_IN_SYNC: "isInSync";
        static readonly NAME: "name";
        static readonly NUMBER_OF_DEPLOYED_VMS: "numberOfDeployedVMs";
        static readonly NUMBER_OF_STORED_VMS: "numberOfStoredVMs";
        static readonly ORG: "org";
    }
}

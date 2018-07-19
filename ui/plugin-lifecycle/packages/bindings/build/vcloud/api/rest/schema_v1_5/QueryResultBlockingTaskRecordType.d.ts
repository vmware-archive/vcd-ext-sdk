import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultBlockingTaskRecordType extends QueryResultRecordType {
    creationDate?: Date;
    expirationTime?: Date;
    hasOwner?: boolean;
    jobStatus?: string;
    operationName?: string;
    originatingOrg?: string;
    originatingOrgName?: string;
    owner?: string;
    ownerName?: string;
    status?: string;
    task?: string;
    timeoutAction?: string;
}
export declare namespace QueryResultBlockingTaskRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CREATION_DATE: "creationDate";
        static readonly EXPIRATION_TIME: "expirationTime";
        static readonly HAS_OWNER: "hasOwner";
        static readonly JOB_STATUS: "jobStatus";
        static readonly OPERATION_NAME: "operationName";
        static readonly ORIGINATING_ORG: "originatingOrg";
        static readonly ORIGINATING_ORG_NAME: "originatingOrgName";
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly TASK: "task";
        static readonly TIMEOUT_ACTION: "timeoutAction";
    }
}

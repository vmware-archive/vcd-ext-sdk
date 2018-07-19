import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminTaskRecordType extends QueryResultRecordType {
    cellName?: string;
    endDate?: Date;
    hasOwner?: boolean;
    name?: string;
    object?: string;
    objectName?: string;
    objectType?: string;
    org?: string;
    orgName?: string;
    owner?: string;
    ownerName?: string;
    progress?: number;
    serviceNamespace?: string;
    startDate?: Date;
    status?: string;
}
export declare namespace QueryResultAdminTaskRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CELL_NAME: "cellName";
        static readonly END_DATE: "endDate";
        static readonly HAS_OWNER: "hasOwner";
        static readonly NAME: "name";
        static readonly OBJECT: "object";
        static readonly OBJECT_NAME: "objectName";
        static readonly OBJECT_TYPE: "objectType";
        static readonly ORG: "org";
        static readonly ORG_NAME: "orgName";
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
        static readonly PROGRESS: "progress";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly START_DATE: "startDate";
        static readonly STATUS: "status";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultTaskRecordType extends QueryResultRecordType {
    endDate?: Date;
    name?: string;
    object?: string;
    objectName?: string;
    objectType?: string;
    org?: string;
    orgName?: string;
    ownerName?: string;
    progress?: number;
    serviceNamespace?: string;
    startDate?: Date;
    status?: string;
}
export declare namespace QueryResultTaskRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly END_DATE: "endDate";
        static readonly NAME: "name";
        static readonly OBJECT: "object";
        static readonly OBJECT_NAME: "objectName";
        static readonly OBJECT_TYPE: "objectType";
        static readonly ORG: "org";
        static readonly ORG_NAME: "orgName";
        static readonly OWNER_NAME: "ownerName";
        static readonly PROGRESS: "progress";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly START_DATE: "startDate";
        static readonly STATUS: "status";
    }
}

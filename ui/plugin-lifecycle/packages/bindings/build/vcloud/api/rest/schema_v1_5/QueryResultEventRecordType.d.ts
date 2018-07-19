import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultEventRecordType extends QueryResultRecordType {
    entity?: string;
    entityName?: string;
    entityType?: string;
    eventStatus?: number;
    eventType?: string;
    orgName?: string;
    serviceNamespace?: string;
    timeStamp?: Date;
    userName?: string;
}
export declare namespace QueryResultEventRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly ENTITY: "entity";
        static readonly ENTITY_NAME: "entityName";
        static readonly ENTITY_TYPE: "entityType";
        static readonly EVENT_STATUS: "eventStatus";
        static readonly EVENT_TYPE: "eventType";
        static readonly ORG_NAME: "orgName";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly TIME_STAMP: "timeStamp";
        static readonly USER_NAME: "userName";
    }
}

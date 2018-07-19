import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminEventRecordType extends QueryResultRecordType {
    entity?: string;
    entityName?: string;
    entityType?: string;
    eventId?: string;
    eventStatus?: number;
    eventType?: string;
    org?: string;
    orgName?: string;
    productVersion?: string;
    serviceNamespace?: string;
    timeStamp?: Date;
    userName?: string;
}
export declare namespace QueryResultAdminEventRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly ENTITY: "entity";
        static readonly ENTITY_NAME: "entityName";
        static readonly ENTITY_TYPE: "entityType";
        static readonly EVENT_ID: "eventId";
        static readonly EVENT_STATUS: "eventStatus";
        static readonly EVENT_TYPE: "eventType";
        static readonly ORG: "org";
        static readonly ORG_NAME: "orgName";
        static readonly PRODUCT_VERSION: "productVersion";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly TIME_STAMP: "timeStamp";
        static readonly USER_NAME: "userName";
    }
}

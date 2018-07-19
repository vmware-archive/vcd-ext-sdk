import { EntityType } from "./EntityType";
import { ReferenceType } from "./ReferenceType";
export declare class AuditEventType extends EntityType {
    org?: ReferenceType;
    owner?: ReferenceType;
    user?: ReferenceType;
    details?: string;
    eventType?: string;
    serviceNamespace?: string;
    success?: boolean;
    timeStamp?: Date;
}
export declare namespace AuditEventType {
    class Fields extends EntityType.Fields {
        static readonly ORG: "org";
        static readonly OWNER: "owner";
        static readonly USER: "user";
        static readonly DETAILS: "details";
        static readonly EVENT_TYPE: "eventType";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly SUCCESS: "success";
        static readonly TIME_STAMP: "timeStamp";
    }
}

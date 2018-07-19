import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { EventPropertiesType } from "./EventPropertiesType";
import { ReferenceType } from "./ReferenceType";
export declare class EventType extends VCloudExtensibleType {
    owner?: ReferenceType;
    user?: ReferenceType;
    eventProperties?: EventPropertiesType;
    serviceNamespace?: string;
    success?: boolean;
    type?: string;
    typeFull?: string;
}
export declare namespace EventType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly OWNER: "owner";
        static readonly USER: "user";
        static readonly EVENT_PROPERTIES: "eventProperties";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly SUCCESS: "success";
        static readonly TYPE: "type";
        static readonly TYPE_FULL: "typeFull";
    }
}

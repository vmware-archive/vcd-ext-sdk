import { EntityLinkType } from "./../EntityLinkType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
import { LinkType } from "./../LinkType";
export declare class NotificationType extends VCloudExtensibleType {
    link?: LinkType[];
    entityLink?: EntityLinkType[];
    timestamp?: Date;
    operationSuccess?: boolean;
    eventId?: string;
    type?: string;
}
export declare namespace NotificationType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly LINK: "link";
        static readonly ENTITY_LINK: "entityLink";
        static readonly TIMESTAMP: "timestamp";
        static readonly OPERATION_SUCCESS: "operationSuccess";
        static readonly EVENT_ID: "eventId";
        static readonly TYPE: "type";
    }
}

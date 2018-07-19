import { AdminServiceLinkType } from "./AdminServiceLinkType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
export declare class AdminServiceLinksType extends VCloudExtensibleType {
    serviceLink?: AdminServiceLinkType[];
}
export declare namespace AdminServiceLinksType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SERVICE_LINK: "serviceLink";
    }
}

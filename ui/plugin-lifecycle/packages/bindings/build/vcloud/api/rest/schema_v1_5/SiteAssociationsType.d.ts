import { SiteAssociationType } from "./SiteAssociationType";
import { ResourceType } from "./ResourceType";
export declare class SiteAssociationsType extends ResourceType {
    siteAssociationMember?: SiteAssociationType[];
}
export declare namespace SiteAssociationsType {
    class Fields extends ResourceType.Fields {
        static readonly SITE_ASSOCIATION_MEMBER: "siteAssociationMember";
    }
}

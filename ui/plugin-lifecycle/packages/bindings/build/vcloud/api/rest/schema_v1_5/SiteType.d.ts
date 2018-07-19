import { SiteAssociationsType } from "./SiteAssociationsType";
import { MultisiteType } from "./MultisiteType";
export declare class SiteType extends MultisiteType {
    multiSiteUrl?: string;
    siteAssociations?: SiteAssociationsType;
}
export declare namespace SiteType {
    class Fields extends MultisiteType.Fields {
        static readonly MULTI_SITE_URL: "multiSiteUrl";
        static readonly SITE_ASSOCIATIONS: "siteAssociations";
    }
}

import { ResourceType } from "./ResourceType";
export declare class SiteStatusType extends ResourceType {
    siteId?: string;
    siteName?: string;
}
export declare namespace SiteStatusType {
    class Fields extends ResourceType.Fields {
        static readonly SITE_ID: "siteId";
        static readonly SITE_NAME: "siteName";
    }
}

import { MultisiteType } from "./MultisiteType";
export declare class SiteAssociationType extends MultisiteType {
    siteId?: string;
    siteName?: string;
    publicKey?: string;
    status?: string;
}
export declare namespace SiteAssociationType {
    class Fields extends MultisiteType.Fields {
        static readonly SITE_ID: "siteId";
        static readonly SITE_NAME: "siteName";
        static readonly PUBLIC_KEY: "publicKey";
        static readonly STATUS: "status";
    }
}

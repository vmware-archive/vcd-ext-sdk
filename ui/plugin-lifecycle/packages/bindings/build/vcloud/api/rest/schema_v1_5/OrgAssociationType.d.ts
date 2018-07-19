import { ResourceType } from "./ResourceType";
export declare class OrgAssociationType extends ResourceType {
    siteId?: string;
    orgId?: string;
    siteName?: string;
    orgName?: string;
    orgPublicKey?: string;
    status?: string;
}
export declare namespace OrgAssociationType {
    class Fields extends ResourceType.Fields {
        static readonly SITE_ID: "siteId";
        static readonly ORG_ID: "orgId";
        static readonly SITE_NAME: "siteName";
        static readonly ORG_NAME: "orgName";
        static readonly ORG_PUBLIC_KEY: "orgPublicKey";
        static readonly STATUS: "status";
    }
}

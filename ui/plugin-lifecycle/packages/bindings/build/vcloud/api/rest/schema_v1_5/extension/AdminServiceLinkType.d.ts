import { IdentifiableResourceType } from "./../IdentifiableResourceType";
export declare class AdminServiceLinkType extends IdentifiableResourceType {
    linkHref?: string;
    mimeType?: string;
    rel?: string;
    resourceType?: string;
    resourceId?: string;
    externalResourceId?: string;
}
export declare namespace AdminServiceLinkType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly LINK_HREF: "linkHref";
        static readonly MIME_TYPE: "mimeType";
        static readonly REL: "rel";
        static readonly RESOURCE_TYPE: "resourceType";
        static readonly RESOURCE_ID: "resourceId";
        static readonly EXTERNAL_RESOURCE_ID: "externalResourceId";
    }
}

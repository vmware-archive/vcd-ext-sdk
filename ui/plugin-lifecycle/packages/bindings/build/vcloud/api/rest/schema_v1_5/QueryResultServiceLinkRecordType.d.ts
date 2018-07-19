import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultServiceLinkRecordType extends QueryResultRecordType {
    linkHref?: string;
    mimeType?: string;
    rel?: string;
    resourceId?: string;
    resourceType?: string;
    service?: string;
}
export declare namespace QueryResultServiceLinkRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly LINK_HREF: "linkHref";
        static readonly MIME_TYPE: "mimeType";
        static readonly REL: "rel";
        static readonly RESOURCE_ID: "resourceId";
        static readonly RESOURCE_TYPE: "resourceType";
        static readonly SERVICE: "service";
    }
}

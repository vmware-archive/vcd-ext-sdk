import { IdentifiableResourceType } from "./../IdentifiableResourceType";
export declare class ApiFilterType extends IdentifiableResourceType {
    urlPattern?: string;
    responseContentType?: string;
}
export declare namespace ApiFilterType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly URL_PATTERN: "urlPattern";
        static readonly RESPONSE_CONTENT_TYPE: "responseContentType";
    }
}

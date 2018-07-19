import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminFileDescriptorRecordType extends QueryResultRecordType {
    apiDefinition?: string;
    apiName?: string;
    apiNamespace?: string;
    apiVendor?: string;
    fileMimeType?: string;
    fileUrl?: string;
    name?: string;
    service?: string;
    serviceName?: string;
    serviceNamespace?: string;
    serviceVendor?: string;
}
export declare namespace QueryResultAdminFileDescriptorRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly API_DEFINITION: "apiDefinition";
        static readonly API_NAME: "apiName";
        static readonly API_NAMESPACE: "apiNamespace";
        static readonly API_VENDOR: "apiVendor";
        static readonly FILE_MIME_TYPE: "fileMimeType";
        static readonly FILE_URL: "fileUrl";
        static readonly NAME: "name";
        static readonly SERVICE: "service";
        static readonly SERVICE_NAME: "serviceName";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly SERVICE_VENDOR: "serviceVendor";
    }
}

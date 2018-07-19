import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminApiDefinitionRecordType extends QueryResultRecordType {
    apiVendor?: string;
    entryPoint?: string;
    name?: string;
    namespace?: string;
    service?: string;
    serviceName?: string;
    serviceNamespace?: string;
    serviceVendor?: string;
}
export declare namespace QueryResultAdminApiDefinitionRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly API_VENDOR: "apiVendor";
        static readonly ENTRY_POINT: "entryPoint";
        static readonly NAME: "name";
        static readonly NAMESPACE: "namespace";
        static readonly SERVICE: "service";
        static readonly SERVICE_NAME: "serviceName";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly SERVICE_VENDOR: "serviceVendor";
    }
}

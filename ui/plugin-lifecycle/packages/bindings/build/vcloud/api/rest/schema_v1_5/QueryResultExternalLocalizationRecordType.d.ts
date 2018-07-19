import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultExternalLocalizationRecordType extends QueryResultRecordType {
    key?: string;
    locale?: string;
    serviceNamespace?: string;
    value?: string;
}
export declare namespace QueryResultExternalLocalizationRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly KEY: "key";
        static readonly LOCALE: "locale";
        static readonly SERVICE_NAMESPACE: "serviceNamespace";
        static readonly VALUE: "value";
    }
}

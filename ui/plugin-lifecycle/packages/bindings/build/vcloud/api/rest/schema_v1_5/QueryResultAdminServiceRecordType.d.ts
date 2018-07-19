import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminServiceRecordType extends QueryResultRecordType {
    enabled?: boolean;
    exchange?: string;
    isAuthorizationEnabled?: boolean;
    name?: string;
    namespace?: string;
    priority?: number;
    routingKey?: string;
    vendor?: string;
}
export declare namespace QueryResultAdminServiceRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly ENABLED: "enabled";
        static readonly EXCHANGE: "exchange";
        static readonly IS_AUTHORIZATION_ENABLED: "isAuthorizationEnabled";
        static readonly NAME: "name";
        static readonly NAMESPACE: "namespace";
        static readonly PRIORITY: "priority";
        static readonly ROUTING_KEY: "routingKey";
        static readonly VENDOR: "vendor";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultNetworkRecordType extends QueryResultRecordType {
    dns1?: string;
    dns2?: string;
    dnsSuffix?: string;
    gateway?: string;
    ipScopeId?: string;
    isBusy?: boolean;
    name?: string;
    netmask?: string;
}
export declare namespace QueryResultNetworkRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DNS1: "dns1";
        static readonly DNS2: "dns2";
        static readonly DNS_SUFFIX: "dnsSuffix";
        static readonly GATEWAY: "gateway";
        static readonly IP_SCOPE_ID: "ipScopeId";
        static readonly IS_BUSY: "isBusy";
        static readonly NAME: "name";
        static readonly NETMASK: "netmask";
    }
}

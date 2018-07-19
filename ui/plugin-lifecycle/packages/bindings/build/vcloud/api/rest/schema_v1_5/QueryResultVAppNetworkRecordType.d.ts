import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVAppNetworkRecordType extends QueryResultRecordType {
    dns1?: string;
    dns2?: string;
    dnsSuffix?: string;
    gateway?: string;
    ipScopeId?: string;
    isBusy?: boolean;
    isIpScopeInherited?: boolean;
    name?: string;
    netmask?: string;
    vApp?: string;
    vAppName?: string;
}
export declare namespace QueryResultVAppNetworkRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DNS1: "dns1";
        static readonly DNS2: "dns2";
        static readonly DNS_SUFFIX: "dnsSuffix";
        static readonly GATEWAY: "gateway";
        static readonly IP_SCOPE_ID: "ipScopeId";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_IP_SCOPE_INHERITED: "isIpScopeInherited";
        static readonly NAME: "name";
        static readonly NETMASK: "netmask";
        static readonly V_APP: "vApp";
        static readonly V_APP_NAME: "vAppName";
    }
}

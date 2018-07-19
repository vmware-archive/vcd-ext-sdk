import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminVAppNetworkRecordType extends QueryResultRecordType {
    dns1?: string;
    dns2?: string;
    dnsSuffix?: string;
    gateway?: string;
    isBusy?: boolean;
    isIpScopeInherited?: boolean;
    name?: string;
    netmask?: string;
    org?: string;
    vApp?: string;
    vappName?: string;
}
export declare namespace QueryResultAdminVAppNetworkRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DNS1: "dns1";
        static readonly DNS2: "dns2";
        static readonly DNS_SUFFIX: "dnsSuffix";
        static readonly GATEWAY: "gateway";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_IP_SCOPE_INHERITED: "isIpScopeInherited";
        static readonly NAME: "name";
        static readonly NETMASK: "netmask";
        static readonly ORG: "org";
        static readonly V_APP: "vApp";
        static readonly VAPP_NAME: "vappName";
    }
}

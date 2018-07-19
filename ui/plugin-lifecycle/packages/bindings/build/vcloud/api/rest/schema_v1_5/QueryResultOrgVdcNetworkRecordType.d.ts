import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultOrgVdcNetworkRecordType extends QueryResultRecordType {
    connectedTo?: string;
    crossVdcNetworkId?: string;
    crossVdcNetworkSiteId?: string;
    defaultGateway?: string;
    dns1?: string;
    dns2?: string;
    dnsSuffix?: string;
    interfaceType?: number;
    isBusy?: boolean;
    isIpScopeInherited?: boolean;
    isShared?: boolean;
    linkType?: number;
    name?: string;
    netmask?: string;
    totalIpCount?: number;
    usedIpCount?: number;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultOrgVdcNetworkRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CONNECTED_TO: "connectedTo";
        static readonly CROSS_VDC_NETWORK_ID: "crossVdcNetworkId";
        static readonly CROSS_VDC_NETWORK_SITE_ID: "crossVdcNetworkSiteId";
        static readonly DEFAULT_GATEWAY: "defaultGateway";
        static readonly DNS1: "dns1";
        static readonly DNS2: "dns2";
        static readonly DNS_SUFFIX: "dnsSuffix";
        static readonly INTERFACE_TYPE: "interfaceType";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_IP_SCOPE_INHERITED: "isIpScopeInherited";
        static readonly IS_SHARED: "isShared";
        static readonly LINK_TYPE: "linkType";
        static readonly NAME: "name";
        static readonly NETMASK: "netmask";
        static readonly TOTAL_IP_COUNT: "totalIpCount";
        static readonly USED_IP_COUNT: "usedIpCount";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}

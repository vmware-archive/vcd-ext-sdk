import { IpRangeType } from "./IpRangeType";
import { NetworkServiceType } from "./NetworkServiceType";
export declare class DhcpServiceType extends NetworkServiceType {
    defaultLeaseTime?: number;
    maxLeaseTime?: number;
    ipRange?: IpRangeType;
    routerIp?: string;
    subMask?: string;
    primaryNameServer?: string;
    secondaryNameServer?: string;
    domainName?: string;
}
export declare namespace DhcpServiceType {
    class Fields extends NetworkServiceType.Fields {
        static readonly DEFAULT_LEASE_TIME: "defaultLeaseTime";
        static readonly MAX_LEASE_TIME: "maxLeaseTime";
        static readonly IP_RANGE: "ipRange";
        static readonly ROUTER_IP: "routerIp";
        static readonly SUB_MASK: "subMask";
        static readonly PRIMARY_NAME_SERVER: "primaryNameServer";
        static readonly SECONDARY_NAME_SERVER: "secondaryNameServer";
        static readonly DOMAIN_NAME: "domainName";
    }
}

import { IpRangesType } from "./IpRangesType";
import { SubAllocationsType } from "./SubAllocationsType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { IpAddressesType } from "./IpAddressesType";
export declare class IpScopeType extends VCloudExtensibleType {
    isInherited?: boolean;
    gateway?: string;
    netmask?: string;
    dns1?: string;
    dns2?: string;
    dnsSuffix?: string;
    isEnabled?: boolean;
    ipRanges?: IpRangesType;
    allocatedIpAddresses?: IpAddressesType;
    subAllocations?: SubAllocationsType;
}
export declare namespace IpScopeType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_INHERITED: "isInherited";
        static readonly GATEWAY: "gateway";
        static readonly NETMASK: "netmask";
        static readonly DNS1: "dns1";
        static readonly DNS2: "dns2";
        static readonly DNS_SUFFIX: "dnsSuffix";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IP_RANGES: "ipRanges";
        static readonly ALLOCATED_IP_ADDRESSES: "allocatedIpAddresses";
        static readonly SUB_ALLOCATIONS: "subAllocations";
    }
}

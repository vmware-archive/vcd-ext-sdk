import { IpRangesType } from "./IpRangesType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class SubnetParticipationType extends VCloudExtensibleType {
    gateway?: string;
    netmask?: string;
    ipAddress?: string;
    ipRanges?: IpRangesType;
    useForDefaultRoute?: boolean;
}
export declare namespace SubnetParticipationType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly GATEWAY: "gateway";
        static readonly NETMASK: "netmask";
        static readonly IP_ADDRESS: "ipAddress";
        static readonly IP_RANGES: "ipRanges";
        static readonly USE_FOR_DEFAULT_ROUTE: "useForDefaultRoute";
    }
}

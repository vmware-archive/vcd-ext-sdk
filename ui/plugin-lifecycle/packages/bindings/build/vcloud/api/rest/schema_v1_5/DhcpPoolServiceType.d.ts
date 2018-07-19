import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class DhcpPoolServiceType extends VCloudExtensibleType {
    isEnabled?: boolean;
    network?: ReferenceType;
    defaultLeaseTime?: number;
    maxLeaseTime?: number;
    lowIpAddress?: string;
    highIpAddress?: string;
}
export declare namespace DhcpPoolServiceType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_ENABLED: "isEnabled";
        static readonly NETWORK: "network";
        static readonly DEFAULT_LEASE_TIME: "defaultLeaseTime";
        static readonly MAX_LEASE_TIME: "maxLeaseTime";
        static readonly LOW_IP_ADDRESS: "lowIpAddress";
        static readonly HIGH_IP_ADDRESS: "highIpAddress";
    }
}

import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class NetworkConnectionType extends VCloudExtensibleType {
    networkConnectionIndex?: number;
    ipAddress?: string;
    externalIpAddress?: string;
    isConnected?: boolean;
    macAddress?: string;
    ipAddressAllocationMode?: string;
    networkAdapterType?: string;
    needsCustomization?: boolean;
    network?: string;
}
export declare namespace NetworkConnectionType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NETWORK_CONNECTION_INDEX: "networkConnectionIndex";
        static readonly IP_ADDRESS: "ipAddress";
        static readonly EXTERNAL_IP_ADDRESS: "externalIpAddress";
        static readonly IS_CONNECTED: "isConnected";
        static readonly MAC_ADDRESS: "macAddress";
        static readonly IP_ADDRESS_ALLOCATION_MODE: "ipAddressAllocationMode";
        static readonly NETWORK_ADAPTER_TYPE: "networkAdapterType";
        static readonly NEEDS_CUSTOMIZATION: "needsCustomization";
        static readonly NETWORK: "network";
    }
}

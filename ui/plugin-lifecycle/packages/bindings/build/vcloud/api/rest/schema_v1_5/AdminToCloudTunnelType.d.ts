import { ToCloudTunnelType } from "./ToCloudTunnelType";
export declare class AdminToCloudTunnelType extends ToCloudTunnelType {
    destinationIpAddress?: string;
    destinationPort?: number;
    useSsl?: boolean;
}
export declare namespace AdminToCloudTunnelType {
    class Fields extends ToCloudTunnelType.Fields {
        static readonly DESTINATION_IP_ADDRESS: "destinationIpAddress";
        static readonly DESTINATION_PORT: "destinationPort";
        static readonly USE_SSL: "useSsl";
    }
}

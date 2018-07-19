import { FromCloudTunnelType } from "./FromCloudTunnelType";
export declare class AdminFromCloudTunnelType extends FromCloudTunnelType {
    tunnelEndPoint?: string;
}
export declare namespace AdminFromCloudTunnelType {
    class Fields extends FromCloudTunnelType.Fields {
        static readonly TUNNEL_END_POINT: "tunnelEndPoint";
    }
}

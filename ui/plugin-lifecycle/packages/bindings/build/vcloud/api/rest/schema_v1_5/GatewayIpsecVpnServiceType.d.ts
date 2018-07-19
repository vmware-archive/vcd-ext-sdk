import { GatewayIpsecVpnTunnelType } from "./GatewayIpsecVpnTunnelType";
import { NetworkServiceType } from "./NetworkServiceType";
import { GatewayIpsecVpnEndpointType } from "./GatewayIpsecVpnEndpointType";
export declare class GatewayIpsecVpnServiceType extends NetworkServiceType {
    endpoint?: GatewayIpsecVpnEndpointType[];
    tunnel?: GatewayIpsecVpnTunnelType[];
}
export declare namespace GatewayIpsecVpnServiceType {
    class Fields extends NetworkServiceType.Fields {
        static readonly ENDPOINT: "endpoint";
        static readonly TUNNEL: "tunnel";
    }
}

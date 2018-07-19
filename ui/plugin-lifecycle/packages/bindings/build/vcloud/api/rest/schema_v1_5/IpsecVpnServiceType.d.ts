import { NetworkServiceType } from "./NetworkServiceType";
import { IpsecVpnTunnelType } from "./IpsecVpnTunnelType";
export declare class IpsecVpnServiceType extends NetworkServiceType {
    externalIpAddress?: string;
    publicIpAddress?: string;
    ipsecVpnTunnel?: IpsecVpnTunnelType[];
}
export declare namespace IpsecVpnServiceType {
    class Fields extends NetworkServiceType.Fields {
        static readonly EXTERNAL_IP_ADDRESS: "externalIpAddress";
        static readonly PUBLIC_IP_ADDRESS: "publicIpAddress";
        static readonly IPSEC_VPN_TUNNEL: "ipsecVpnTunnel";
    }
}

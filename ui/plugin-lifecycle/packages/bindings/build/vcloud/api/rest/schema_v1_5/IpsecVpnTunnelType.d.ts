import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { IpsecVpnPeerType } from "./IpsecVpnPeerType";
export declare class IpsecVpnTunnelType extends VCloudExtensibleType {
    name?: string;
    description?: string;
    ipsecVpnPeer?: IpsecVpnPeerType;
    peerIpAddress?: string;
    peerNetworkAddress?: string;
    peerNetworkMask?: string;
    sharedSecret?: string;
    encryptionProtocol?: string;
    mtu?: number;
    isEnabled?: boolean;
    isOperational?: boolean;
    errorDetails?: string;
}
export declare namespace IpsecVpnTunnelType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly DESCRIPTION: "description";
        static readonly IPSEC_VPN_PEER: "ipsecVpnPeer";
        static readonly PEER_IP_ADDRESS: "peerIpAddress";
        static readonly PEER_NETWORK_ADDRESS: "peerNetworkAddress";
        static readonly PEER_NETWORK_MASK: "peerNetworkMask";
        static readonly SHARED_SECRET: "sharedSecret";
        static readonly ENCRYPTION_PROTOCOL: "encryptionProtocol";
        static readonly MTU: "mtu";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_OPERATIONAL: "isOperational";
        static readonly ERROR_DETAILS: "errorDetails";
    }
}

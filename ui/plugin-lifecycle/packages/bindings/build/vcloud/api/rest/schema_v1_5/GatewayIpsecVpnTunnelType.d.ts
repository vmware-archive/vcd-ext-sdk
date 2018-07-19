import { IpsecVpnSubnetType } from "./IpsecVpnSubnetType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { IpsecVpnPeerType } from "./IpsecVpnPeerType";
export declare class GatewayIpsecVpnTunnelType extends VCloudExtensibleType {
    name?: string;
    description?: string;
    ipsecVpnPeer?: IpsecVpnPeerType;
    peerIpAddress?: string;
    peerId?: string;
    localIpAddress?: string;
    localId?: string;
    localSubnet?: IpsecVpnSubnetType[];
    peerSubnet?: IpsecVpnSubnetType[];
    sharedSecret?: string;
    sharedSecretEncrypted?: boolean;
    encryptionProtocol?: string;
    mtu?: number;
    isEnabled?: boolean;
    isOperational?: boolean;
    errorDetails?: string;
}
export declare namespace GatewayIpsecVpnTunnelType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly DESCRIPTION: "description";
        static readonly IPSEC_VPN_PEER: "ipsecVpnPeer";
        static readonly PEER_IP_ADDRESS: "peerIpAddress";
        static readonly PEER_ID: "peerId";
        static readonly LOCAL_IP_ADDRESS: "localIpAddress";
        static readonly LOCAL_ID: "localId";
        static readonly LOCAL_SUBNET: "localSubnet";
        static readonly PEER_SUBNET: "peerSubnet";
        static readonly SHARED_SECRET: "sharedSecret";
        static readonly SHARED_SECRET_ENCRYPTED: "sharedSecretEncrypted";
        static readonly ENCRYPTION_PROTOCOL: "encryptionProtocol";
        static readonly MTU: "mtu";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_OPERATIONAL: "isOperational";
        static readonly ERROR_DETAILS: "errorDetails";
    }
}

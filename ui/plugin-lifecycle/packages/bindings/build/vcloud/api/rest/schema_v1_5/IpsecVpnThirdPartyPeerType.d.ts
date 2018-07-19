import { IpsecVpnUnmanagedPeerType } from "./IpsecVpnUnmanagedPeerType";
export declare class IpsecVpnThirdPartyPeerType extends IpsecVpnUnmanagedPeerType {
    peerId?: string;
}
export declare namespace IpsecVpnThirdPartyPeerType {
    class Fields extends IpsecVpnUnmanagedPeerType.Fields {
        static readonly PEER_ID: "peerId";
    }
}

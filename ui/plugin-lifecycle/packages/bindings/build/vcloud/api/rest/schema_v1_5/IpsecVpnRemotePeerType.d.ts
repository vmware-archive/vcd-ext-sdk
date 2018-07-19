import { IpsecVpnManagedPeerType } from "./IpsecVpnManagedPeerType";
export declare class IpsecVpnRemotePeerType extends IpsecVpnManagedPeerType {
    vcdUrl?: string;
    vcdOrganization?: string;
    vcdUsername?: string;
}
export declare namespace IpsecVpnRemotePeerType {
    class Fields extends IpsecVpnManagedPeerType.Fields {
        static readonly VCD_URL: "vcdUrl";
        static readonly VCD_ORGANIZATION: "vcdOrganization";
        static readonly VCD_USERNAME: "vcdUsername";
    }
}

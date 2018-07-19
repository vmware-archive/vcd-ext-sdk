import { IpsecVpnPeerType } from "./IpsecVpnPeerType";
export declare abstract class IpsecVpnManagedPeerType extends IpsecVpnPeerType {
    id?: string;
    name?: string;
}
export declare namespace IpsecVpnManagedPeerType {
    class Fields extends IpsecVpnPeerType.Fields {
        static readonly ID: "id";
        static readonly NAME: "name";
    }
}

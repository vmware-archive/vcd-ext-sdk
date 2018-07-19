import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class IpsecVpnSubnetType extends VCloudExtensibleType {
    name?: string;
    gateway?: string;
    netmask?: string;
}
export declare namespace IpsecVpnSubnetType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly GATEWAY: "gateway";
        static readonly NETMASK: "netmask";
    }
}

import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class IpAddressesType extends VCloudExtensibleType {
    ipAddress?: string[];
}
export declare namespace IpAddressesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IP_ADDRESS: "ipAddress";
    }
}

import { NetworkType } from "./NetworkType";
import { ReferenceType } from "./ReferenceType";
import { IpAddressesType } from "./IpAddressesType";
export declare class OrgNetworkType extends NetworkType {
    networkPool?: ReferenceType;
    allowedExternalIpAddresses?: IpAddressesType;
}
export declare namespace OrgNetworkType {
    class Fields extends NetworkType.Fields {
        static readonly NETWORK_POOL: "networkPool";
        static readonly ALLOWED_EXTERNAL_IP_ADDRESSES: "allowedExternalIpAddresses";
    }
}

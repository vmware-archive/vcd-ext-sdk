import { AllocatedIpAddressType } from "./AllocatedIpAddressType";
import { ResourceType } from "./ResourceType";
export declare class AllocatedIpAddressesType extends ResourceType {
    ipAddress?: AllocatedIpAddressType[];
}
export declare namespace AllocatedIpAddressesType {
    class Fields extends ResourceType.Fields {
        static readonly IP_ADDRESS: "ipAddress";
    }
}

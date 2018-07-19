import { ResourceType } from "./ResourceType";
export declare class AllocatedIpAddressType extends ResourceType {
    ipAddress?: string;
    allocationType?: string;
    isDeployed?: boolean;
}
export declare namespace AllocatedIpAddressType {
    class Fields extends ResourceType.Fields {
        static readonly IP_ADDRESS: "ipAddress";
        static readonly ALLOCATION_TYPE: "allocationType";
        static readonly IS_DEPLOYED: "isDeployed";
    }
}

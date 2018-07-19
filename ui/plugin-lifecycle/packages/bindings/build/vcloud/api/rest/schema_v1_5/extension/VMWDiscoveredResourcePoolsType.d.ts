import { ResourceType } from "./../ResourceType";
import { VMWDiscoveredResourcePoolType } from "./VMWDiscoveredResourcePoolType";
export declare class VMWDiscoveredResourcePoolsType extends ResourceType {
    vmwDiscoveredResourcePool?: VMWDiscoveredResourcePoolType[];
}
export declare namespace VMWDiscoveredResourcePoolsType {
    class Fields extends ResourceType.Fields {
        static readonly VMW_DISCOVERED_RESOURCE_POOL: "vmwDiscoveredResourcePool";
    }
}

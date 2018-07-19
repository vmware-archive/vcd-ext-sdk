import { ResourceType } from "./../ResourceType";
import { ResourcePoolType } from "./ResourcePoolType";
export declare class ResourcePoolListType extends ResourceType {
    resourcePool?: ResourcePoolType[];
}
export declare namespace ResourcePoolListType {
    class Fields extends ResourceType.Fields {
        static readonly RESOURCE_POOL: "resourcePool";
    }
}

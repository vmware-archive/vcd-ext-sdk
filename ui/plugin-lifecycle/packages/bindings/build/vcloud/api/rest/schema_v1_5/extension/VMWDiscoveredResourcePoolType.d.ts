import { ResourceType } from "./../ResourceType";
import { VimObjectRefType } from "./VimObjectRefType";
export declare class VMWDiscoveredResourcePoolType extends ResourceType {
    resourcePoolVimObjectRef?: VimObjectRefType;
    name?: string;
    validCandidate?: boolean;
}
export declare namespace VMWDiscoveredResourcePoolType {
    class Fields extends ResourceType.Fields {
        static readonly RESOURCE_POOL_VIM_OBJECT_REF: "resourcePoolVimObjectRef";
        static readonly NAME: "name";
        static readonly VALID_CANDIDATE: "validCandidate";
    }
}

import { ResourceType } from "./ResourceType";
import { SubAllocationType } from "./SubAllocationType";
export declare class SubAllocationsType extends ResourceType {
    subAllocation?: SubAllocationType[];
}
export declare namespace SubAllocationsType {
    class Fields extends ResourceType.Fields {
        static readonly SUB_ALLOCATION: "subAllocation";
    }
}

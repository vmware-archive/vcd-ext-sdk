import { RASDType } from "./RASDType";
import { SectionType } from "./SectionType";
export declare class ResourceAllocationSectionType extends SectionType {
    item?: RASDType[];
    any?: object[];
}
export declare namespace ResourceAllocationSectionType {
    class Fields extends SectionType.Fields {
        static readonly ITEM: "item";
        static readonly ANY: "any";
    }
}

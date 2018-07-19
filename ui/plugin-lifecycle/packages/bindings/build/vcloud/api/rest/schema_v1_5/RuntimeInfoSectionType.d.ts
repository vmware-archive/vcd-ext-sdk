import { SectionType } from "./../schema/ovf/SectionType";
import { VMWareTools } from "./VMWareTools";
export declare class RuntimeInfoSectionType extends SectionType {
    vmWareTools?: VMWareTools;
    any?: object[];
}
export declare namespace RuntimeInfoSectionType {
    class Fields extends SectionType.Fields {
        static readonly VM_WARE_TOOLS: "vmWareTools";
        static readonly ANY: "any";
    }
}

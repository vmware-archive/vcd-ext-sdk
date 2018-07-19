import { VirtualDiskDescType } from "./VirtualDiskDescType";
import { SectionType } from "./SectionType";
export declare class DiskSectionType extends SectionType {
    disk?: VirtualDiskDescType[];
    any?: object[];
}
export declare namespace DiskSectionType {
    class Fields extends SectionType.Fields {
        static readonly DISK: "disk";
        static readonly ANY: "any";
    }
}

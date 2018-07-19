import { SectionType } from "./../SectionType";
import { Description } from "./Description";
export declare class StorageGroupSectionType extends SectionType {
    description?: Description[];
}
export declare namespace StorageGroupSectionType {
    class Fields extends SectionType.Fields {
        static readonly DESCRIPTION: "description";
    }
}

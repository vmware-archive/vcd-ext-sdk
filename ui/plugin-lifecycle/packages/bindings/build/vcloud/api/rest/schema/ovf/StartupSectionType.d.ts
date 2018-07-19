import { StartupSectionItem } from "./StartupSectionItem";
import { SectionType } from "./SectionType";
export declare class StartupSectionType extends SectionType {
    item?: StartupSectionItem[];
    any?: object[];
}
export declare namespace StartupSectionType {
    class Fields extends SectionType.Fields {
        static readonly ITEM: "item";
        static readonly ANY: "any";
    }
}

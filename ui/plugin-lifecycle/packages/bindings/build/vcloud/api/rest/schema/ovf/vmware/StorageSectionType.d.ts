import { SectionType } from "./../SectionType";
export declare class StorageSectionType extends SectionType {
    type?: string;
}
export declare namespace StorageSectionType {
    class Fields extends SectionType.Fields {
        static readonly TYPE: "type";
    }
}

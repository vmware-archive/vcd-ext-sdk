import { SectionType } from "./../schema/ovf/SectionType";
export declare class DefaultStorageProfileSectionType extends SectionType {
    storageProfile?: string;
    any?: object[];
}
export declare namespace DefaultStorageProfileSectionType {
    class Fields extends SectionType.Fields {
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly ANY: "any";
    }
}

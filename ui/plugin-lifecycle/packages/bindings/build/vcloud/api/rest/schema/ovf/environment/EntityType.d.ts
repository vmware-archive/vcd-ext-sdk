import { SectionType } from "./SectionType";
export declare class EntityType {
    section?: SectionType[];
    any?: object[];
    id?: string;
    otherAttributes?: object;
}
export declare namespace EntityType {
    class Fields {
        static readonly SECTION: "section";
        static readonly ANY: "any";
        static readonly ID: "id";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}

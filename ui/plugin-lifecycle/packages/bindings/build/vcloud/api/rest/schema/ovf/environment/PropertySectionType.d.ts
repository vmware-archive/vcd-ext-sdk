import { Property } from "./Property";
import { SectionType } from "./SectionType";
export declare class PropertySectionType extends SectionType {
    property?: Property[];
    any?: object[];
}
export declare namespace PropertySectionType {
    class Fields extends SectionType.Fields {
        static readonly PROPERTY: "property";
        static readonly ANY: "any";
    }
}

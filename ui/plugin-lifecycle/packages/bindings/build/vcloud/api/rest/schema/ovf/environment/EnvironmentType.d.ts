import { EntityType } from "./EntityType";
import { SectionType } from "./SectionType";
export declare class EnvironmentType {
    section?: SectionType[];
    entity?: EntityType[];
    any?: object[];
    id?: string;
    otherAttributes?: object;
}
export declare namespace EnvironmentType {
    class Fields {
        static readonly SECTION: "section";
        static readonly ENTITY: "entity";
        static readonly ANY: "any";
        static readonly ID: "id";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}

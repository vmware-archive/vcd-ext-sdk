import { PropertyType } from "./PropertyType";
import { EntityType } from "./EntityType";
import { ReferenceType } from "./ReferenceType";
export declare class CatalogItemType extends EntityType {
    entity?: ReferenceType;
    property?: PropertyType[];
    dateCreated?: Date;
    versionNumber?: number;
    size?: number;
}
export declare namespace CatalogItemType {
    class Fields extends EntityType.Fields {
        static readonly ENTITY: "entity";
        static readonly PROPERTY: "property";
        static readonly DATE_CREATED: "dateCreated";
        static readonly VERSION_NUMBER: "versionNumber";
        static readonly SIZE: "size";
    }
}

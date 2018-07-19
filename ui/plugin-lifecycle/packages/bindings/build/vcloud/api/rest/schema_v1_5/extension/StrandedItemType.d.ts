import { EntityType } from "./../EntityType";
import { StrandedItemVimObjectsType } from "./StrandedItemVimObjectsType";
import { ReferenceType } from "./../ReferenceType";
export declare class StrandedItemType extends EntityType {
    entityType?: string;
    deletionDate?: Date;
    errorMessage?: string;
    parent?: ReferenceType;
    strandedItemVimObjects?: StrandedItemVimObjectsType;
}
export declare namespace StrandedItemType {
    class Fields extends EntityType.Fields {
        static readonly ENTITY_TYPE: "entityType";
        static readonly DELETION_DATE: "deletionDate";
        static readonly ERROR_MESSAGE: "errorMessage";
        static readonly PARENT: "parent";
        static readonly STRANDED_ITEM_VIM_OBJECTS: "strandedItemVimObjects";
    }
}

import { OwnerType } from "./OwnerType";
import { EntityType } from "./EntityType";
import { CatalogItemsType } from "./CatalogItemsType";
export declare class CatalogType extends EntityType {
    owner?: OwnerType;
    catalogItems?: CatalogItemsType;
    isPublished?: boolean;
    dateCreated?: Date;
    versionNumber?: number;
}
export declare namespace CatalogType {
    class Fields extends EntityType.Fields {
        static readonly OWNER: "owner";
        static readonly CATALOG_ITEMS: "catalogItems";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly DATE_CREATED: "dateCreated";
        static readonly VERSION_NUMBER: "versionNumber";
    }
}

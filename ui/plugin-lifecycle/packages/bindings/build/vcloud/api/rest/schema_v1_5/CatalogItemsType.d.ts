import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class CatalogItemsType extends VCloudExtensibleType {
    catalogItem?: ReferenceType[];
}
export declare namespace CatalogItemsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly CATALOG_ITEM: "catalogItem";
    }
}

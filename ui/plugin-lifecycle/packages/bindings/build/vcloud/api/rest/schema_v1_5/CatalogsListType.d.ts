import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class CatalogsListType extends VCloudExtensibleType {
    catalogReference?: ReferenceType[];
}
export declare namespace CatalogsListType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly CATALOG_REFERENCE: "catalogReference";
    }
}

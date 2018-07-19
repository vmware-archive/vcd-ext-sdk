import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class CatalogStorageProfilesType extends VCloudExtensibleType {
    vdcStorageProfile?: ReferenceType[];
}
export declare namespace CatalogStorageProfilesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
    }
}

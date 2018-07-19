import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class VdcStorageProfilesType extends VCloudExtensibleType {
    vdcStorageProfile?: ReferenceType[];
}
export declare namespace VdcStorageProfilesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
    }
}

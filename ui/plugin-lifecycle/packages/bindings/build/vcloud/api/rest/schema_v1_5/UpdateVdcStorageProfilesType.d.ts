import { VdcStorageProfileParamsType } from "./VdcStorageProfileParamsType";
import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class UpdateVdcStorageProfilesType extends ParamsType {
    addStorageProfile?: VdcStorageProfileParamsType[];
    removeStorageProfile?: ReferenceType[];
}
export declare namespace UpdateVdcStorageProfilesType {
    class Fields extends ParamsType.Fields {
        static readonly ADD_STORAGE_PROFILE: "addStorageProfile";
        static readonly REMOVE_STORAGE_PROFILE: "removeStorageProfile";
    }
}

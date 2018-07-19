import { ParamsType } from "./../ParamsType";
import { ReferenceType } from "./../ReferenceType";
export declare class UpdateProviderVdcStorageProfilesParamsType extends ParamsType {
    addStorageProfile?: string[];
    removeStorageProfile?: ReferenceType[];
}
export declare namespace UpdateProviderVdcStorageProfilesParamsType {
    class Fields extends ParamsType.Fields {
        static readonly ADD_STORAGE_PROFILE: "addStorageProfile";
        static readonly REMOVE_STORAGE_PROFILE: "removeStorageProfile";
    }
}

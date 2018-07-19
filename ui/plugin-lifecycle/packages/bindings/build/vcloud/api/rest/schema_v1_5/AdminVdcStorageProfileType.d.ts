import { VdcStorageProfileType } from "./VdcStorageProfileType";
import { ReferenceType } from "./ReferenceType";
export declare class AdminVdcStorageProfileType extends VdcStorageProfileType {
    providerVdcStorageProfile?: ReferenceType;
}
export declare namespace AdminVdcStorageProfileType {
    class Fields extends VdcStorageProfileType.Fields {
        static readonly PROVIDER_VDC_STORAGE_PROFILE: "providerVdcStorageProfile";
    }
}

import { VdcStorageProfileIopsSettingsType } from "./VdcStorageProfileIopsSettingsType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class VdcStorageProfileParamsType extends VCloudExtensibleType {
    enabled?: boolean;
    units?: string;
    limit?: number;
    _default?: boolean;
    iopsSettings?: VdcStorageProfileIopsSettingsType;
    providerVdcStorageProfile?: ReferenceType;
}
export declare namespace VdcStorageProfileParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ENABLED: "enabled";
        static readonly UNITS: "units";
        static readonly LIMIT: "limit";
        static readonly _DEFAULT: "_default";
        static readonly IOPS_SETTINGS: "iopsSettings";
        static readonly PROVIDER_VDC_STORAGE_PROFILE: "providerVdcStorageProfile";
    }
}

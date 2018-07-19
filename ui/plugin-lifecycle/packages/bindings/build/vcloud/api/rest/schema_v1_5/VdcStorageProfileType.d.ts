import { VdcStorageProfileIopsSettingsType } from "./VdcStorageProfileIopsSettingsType";
import { EntityType } from "./EntityType";
export declare class VdcStorageProfileType extends EntityType {
    enabled?: boolean;
    units?: string;
    limit?: number;
    _default?: boolean;
    iopsSettings?: VdcStorageProfileIopsSettingsType;
    storageUsedMB?: number;
    iopsAllocated?: number;
}
export declare namespace VdcStorageProfileType {
    class Fields extends EntityType.Fields {
        static readonly ENABLED: "enabled";
        static readonly UNITS: "units";
        static readonly LIMIT: "limit";
        static readonly _DEFAULT: "_default";
        static readonly IOPS_SETTINGS: "iopsSettings";
        static readonly STORAGE_USED_MB: "storageUsedMB";
        static readonly IOPS_ALLOCATED: "iopsAllocated";
    }
}

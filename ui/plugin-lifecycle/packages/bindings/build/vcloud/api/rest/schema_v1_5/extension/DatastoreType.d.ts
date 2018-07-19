import { EntityType } from "./../EntityType";
import { VimObjectRefType } from "./VimObjectRefType";
import { VimObjectRefsType } from "./VimObjectRefsType";
export declare class DatastoreType extends EntityType {
    vimObjectRef?: VimObjectRefType;
    enabled?: boolean;
    busy?: boolean;
    vaaiForFpEnabled?: boolean;
    thresholdYellowGb?: number;
    thresholdRedGb?: number;
    systemMessages?: string;
    datastoreFsType?: string;
    vcDisplayName?: string;
    mountHost?: string;
    mountDirectory?: string;
    totalCapacityMb?: number;
    totalCapacityGb?: number;
    usedCapacityMb?: number;
    usedCapacityGb?: number;
    usedCapacityPercent?: number;
    provisionedSpaceMb?: number;
    provisionedSpaceGb?: number;
    requestedStorageMb?: number;
    requestedStorageGb?: number;
    vimPropertyPageUrl?: string;
    members?: VimObjectRefsType;
}
export declare namespace DatastoreType {
    class Fields extends EntityType.Fields {
        static readonly VIM_OBJECT_REF: "vimObjectRef";
        static readonly ENABLED: "enabled";
        static readonly BUSY: "busy";
        static readonly VAAI_FOR_FP_ENABLED: "vaaiForFpEnabled";
        static readonly THRESHOLD_YELLOW_GB: "thresholdYellowGb";
        static readonly THRESHOLD_RED_GB: "thresholdRedGb";
        static readonly SYSTEM_MESSAGES: "systemMessages";
        static readonly DATASTORE_FS_TYPE: "datastoreFsType";
        static readonly VC_DISPLAY_NAME: "vcDisplayName";
        static readonly MOUNT_HOST: "mountHost";
        static readonly MOUNT_DIRECTORY: "mountDirectory";
        static readonly TOTAL_CAPACITY_MB: "totalCapacityMb";
        static readonly TOTAL_CAPACITY_GB: "totalCapacityGb";
        static readonly USED_CAPACITY_MB: "usedCapacityMb";
        static readonly USED_CAPACITY_GB: "usedCapacityGb";
        static readonly USED_CAPACITY_PERCENT: "usedCapacityPercent";
        static readonly PROVISIONED_SPACE_MB: "provisionedSpaceMb";
        static readonly PROVISIONED_SPACE_GB: "provisionedSpaceGb";
        static readonly REQUESTED_STORAGE_MB: "requestedStorageMb";
        static readonly REQUESTED_STORAGE_GB: "requestedStorageGb";
        static readonly VIM_PROPERTY_PAGE_URL: "vimPropertyPageUrl";
        static readonly MEMBERS: "members";
    }
}

import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class DiskSettingsType extends VCloudExtensibleType {
    diskId?: string;
    sizeMb?: number;
    unitNumber?: number;
    busNumber?: number;
    adapterType?: string;
    thinProvisioned?: boolean;
    disk?: ReferenceType;
    storageProfile?: ReferenceType;
    overrideVmDefault?: boolean;
    iops?: number;
    virtualQuantityUnit?: string;
    virtualQuantity?: number;
}
export declare namespace DiskSettingsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DISK_ID: "diskId";
        static readonly SIZE_MB: "sizeMb";
        static readonly UNIT_NUMBER: "unitNumber";
        static readonly BUS_NUMBER: "busNumber";
        static readonly ADAPTER_TYPE: "adapterType";
        static readonly THIN_PROVISIONED: "thinProvisioned";
        static readonly DISK: "disk";
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly OVERRIDE_VM_DEFAULT: "overrideVmDefault";
        static readonly IOPS: "iops";
        static readonly VIRTUAL_QUANTITY_UNIT: "virtualQuantityUnit";
        static readonly VIRTUAL_QUANTITY: "virtualQuantity";
    }
}

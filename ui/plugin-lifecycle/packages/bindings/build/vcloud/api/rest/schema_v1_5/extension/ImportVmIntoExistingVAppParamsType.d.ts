import { ImportedDiskType } from "./ImportedDiskType";
import { VCloudExtensibleType } from "./../VCloudExtensibleType";
import { ReferenceType } from "./../ReferenceType";
export declare class ImportVmIntoExistingVAppParamsType extends VCloudExtensibleType {
    vmName?: string;
    vmDescription?: string;
    vAppScopedLocalId?: string;
    computerName?: string;
    vmMoRef?: string;
    vdcStorageProfile?: ReferenceType;
    vApp?: ReferenceType;
    importedDisk?: ImportedDiskType[];
    sourceMove?: boolean;
}
export declare namespace ImportVmIntoExistingVAppParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly VM_NAME: "vmName";
        static readonly VM_DESCRIPTION: "vmDescription";
        static readonly V_APP_SCOPED_LOCAL_ID: "vAppScopedLocalId";
        static readonly COMPUTER_NAME: "computerName";
        static readonly VM_MO_REF: "vmMoRef";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly V_APP: "vApp";
        static readonly IMPORTED_DISK: "importedDisk";
        static readonly SOURCE_MOVE: "sourceMove";
    }
}

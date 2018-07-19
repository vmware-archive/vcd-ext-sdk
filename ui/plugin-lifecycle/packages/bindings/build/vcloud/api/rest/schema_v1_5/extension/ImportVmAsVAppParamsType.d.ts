import { VAppCreationParamsType } from "./../VAppCreationParamsType";
import { ImportedDiskType } from "./ImportedDiskType";
import { ReferenceType } from "./../ReferenceType";
export declare class ImportVmAsVAppParamsType extends VAppCreationParamsType {
    vmName?: string;
    vAppScopedLocalId?: string;
    computerName?: string;
    vmMoRef?: string;
    vdcStorageProfile?: ReferenceType;
    vdc?: ReferenceType;
    importedDisk?: ImportedDiskType[];
    sourceMove?: boolean;
}
export declare namespace ImportVmAsVAppParamsType {
    class Fields extends VAppCreationParamsType.Fields {
        static readonly VM_NAME: "vmName";
        static readonly V_APP_SCOPED_LOCAL_ID: "vAppScopedLocalId";
        static readonly COMPUTER_NAME: "computerName";
        static readonly VM_MO_REF: "vmMoRef";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly VDC: "vdc";
        static readonly IMPORTED_DISK: "importedDisk";
        static readonly SOURCE_MOVE: "sourceMove";
    }
}

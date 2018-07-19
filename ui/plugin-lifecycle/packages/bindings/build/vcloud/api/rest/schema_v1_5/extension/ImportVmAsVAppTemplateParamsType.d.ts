import { ParamsType } from "./../ParamsType";
import { ReferenceType } from "./../ReferenceType";
export declare class ImportVmAsVAppTemplateParamsType extends ParamsType {
    vmName?: string;
    vAppScopedLocalId?: string;
    computerName?: string;
    vmMoRef?: string;
    vdc?: ReferenceType;
    vdcStorageProfile?: ReferenceType;
    catalog?: ReferenceType;
    goldMaster?: boolean;
    sourceMove?: boolean;
}
export declare namespace ImportVmAsVAppTemplateParamsType {
    class Fields extends ParamsType.Fields {
        static readonly VM_NAME: "vmName";
        static readonly V_APP_SCOPED_LOCAL_ID: "vAppScopedLocalId";
        static readonly COMPUTER_NAME: "computerName";
        static readonly VM_MO_REF: "vmMoRef";
        static readonly VDC: "vdc";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly CATALOG: "catalog";
        static readonly GOLD_MASTER: "goldMaster";
        static readonly SOURCE_MOVE: "sourceMove";
    }
}

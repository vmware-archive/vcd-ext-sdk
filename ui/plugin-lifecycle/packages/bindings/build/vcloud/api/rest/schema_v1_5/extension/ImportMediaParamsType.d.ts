import { ParamsType } from "./../ParamsType";
import { ReferenceType } from "./../ReferenceType";
export declare class ImportMediaParamsType extends ParamsType {
    datastoreMoRef?: string;
    sourcePath?: string;
    vdc?: ReferenceType;
    catalog?: ReferenceType;
    vdcStorageProfile?: ReferenceType;
    sourceMove?: boolean;
}
export declare namespace ImportMediaParamsType {
    class Fields extends ParamsType.Fields {
        static readonly DATASTORE_MO_REF: "datastoreMoRef";
        static readonly SOURCE_PATH: "sourcePath";
        static readonly VDC: "vdc";
        static readonly CATALOG: "catalog";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly SOURCE_MOVE: "sourceMove";
    }
}

import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class CloneMediaParamsType extends ParamsType {
    source?: ReferenceType;
    isSourceDelete?: boolean;
    vdcStorageProfile?: ReferenceType;
}
export declare namespace CloneMediaParamsType {
    class Fields extends ParamsType.Fields {
        static readonly SOURCE: "source";
        static readonly IS_SOURCE_DELETE: "isSourceDelete";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
    }
}

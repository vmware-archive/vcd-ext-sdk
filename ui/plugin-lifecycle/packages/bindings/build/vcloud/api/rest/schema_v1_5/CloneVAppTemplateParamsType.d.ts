import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class CloneVAppTemplateParamsType extends ParamsType {
    source?: ReferenceType;
    isSourceDelete?: boolean;
    vdcStorageProfile?: ReferenceType;
}
export declare namespace CloneVAppTemplateParamsType {
    class Fields extends ParamsType.Fields {
        static readonly SOURCE: "source";
        static readonly IS_SOURCE_DELETE: "isSourceDelete";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
    }
}

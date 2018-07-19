import { SectionType } from "./../schema/ovf/SectionType";
import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class CaptureVAppParamsType extends ParamsType {
    source?: ReferenceType;
    section?: SectionType[];
    vdcStorageProfile?: ReferenceType;
    targetCatalogItem?: ReferenceType;
}
export declare namespace CaptureVAppParamsType {
    class Fields extends ParamsType.Fields {
        static readonly SOURCE: "source";
        static readonly SECTION: "section";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly TARGET_CATALOG_ITEM: "targetCatalogItem";
    }
}

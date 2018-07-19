import { ResourceType } from "./ResourceType";
import { ReferenceType } from "./ReferenceType";
export declare class VdcTemplateListType extends ResourceType {
    vdcTemplate?: ReferenceType[];
}
export declare namespace VdcTemplateListType {
    class Fields extends ResourceType.Fields {
        static readonly VDC_TEMPLATE: "vdcTemplate";
    }
}

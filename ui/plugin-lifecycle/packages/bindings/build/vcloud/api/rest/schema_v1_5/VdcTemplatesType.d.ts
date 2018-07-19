import { ResourceType } from "./ResourceType";
import { VdcTemplateType } from "./VdcTemplateType";
export declare class VdcTemplatesType extends ResourceType {
    vdcTemplate?: VdcTemplateType[];
}
export declare namespace VdcTemplatesType {
    class Fields extends ResourceType.Fields {
        static readonly VDC_TEMPLATE: "vdcTemplate";
    }
}

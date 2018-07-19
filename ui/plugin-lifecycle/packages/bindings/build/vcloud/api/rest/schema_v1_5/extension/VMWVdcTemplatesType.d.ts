import { ResourceType } from "./../ResourceType";
import { VMWVdcTemplateType } from "./VMWVdcTemplateType";
export declare class VMWVdcTemplatesType extends ResourceType {
    vmwVdcTemplate?: VMWVdcTemplateType[];
}
export declare namespace VMWVdcTemplatesType {
    class Fields extends ResourceType.Fields {
        static readonly VMW_VDC_TEMPLATE: "vmwVdcTemplate";
    }
}

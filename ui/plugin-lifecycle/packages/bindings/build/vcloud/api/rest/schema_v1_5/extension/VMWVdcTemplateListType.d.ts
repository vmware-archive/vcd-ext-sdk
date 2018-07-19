import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWVdcTemplateListType extends ResourceType {
    vmwVdcTemplate?: ReferenceType[];
}
export declare namespace VMWVdcTemplateListType {
    class Fields extends ResourceType.Fields {
        static readonly VMW_VDC_TEMPLATE: "vmwVdcTemplate";
    }
}

import { EntityType } from "./EntityType";
import { VdcTemplateSpecificationType } from "./VdcTemplateSpecificationType";
export declare class VdcTemplateType extends EntityType {
    vdcTemplateSpecification?: VdcTemplateSpecificationType;
}
export declare namespace VdcTemplateType {
    class Fields extends EntityType.Fields {
        static readonly VDC_TEMPLATE_SPECIFICATION: "vdcTemplateSpecification";
    }
}

import { SourcedVmTemplateParamsType } from "./SourcedVmTemplateParamsType";
import { ParamsType } from "./ParamsType";
export declare class InstantiateVmTemplateParamsType extends ParamsType {
    sourcedVmTemplateItem?: SourcedVmTemplateParamsType;
    allEULAsAccepted?: boolean;
    powerOn?: boolean;
}
export declare namespace InstantiateVmTemplateParamsType {
    class Fields extends ParamsType.Fields {
        static readonly SOURCED_VM_TEMPLATE_ITEM: "sourcedVmTemplateItem";
        static readonly ALL_EU_LAS_ACCEPTED: "allEULAsAccepted";
        static readonly POWER_ON: "powerOn";
    }
}

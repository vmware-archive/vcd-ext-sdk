import { ReferenceType } from "./../ReferenceType";
import { VMWVdcTemplateBindingType } from "./VMWVdcTemplateBindingType";
export declare class VMWVdcTemplateProviderVdcSpecificationType extends ReferenceType {
    binding?: VMWVdcTemplateBindingType[];
}
export declare namespace VMWVdcTemplateProviderVdcSpecificationType {
    class Fields extends ReferenceType.Fields {
        static readonly BINDING: "binding";
    }
}

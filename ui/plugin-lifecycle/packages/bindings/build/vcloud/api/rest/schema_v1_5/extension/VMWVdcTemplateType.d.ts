import { EntityType } from "./../EntityType";
import { VMWVdcTemplateSpecificationType } from "./VMWVdcTemplateSpecificationType";
import { VMWVdcTemplateProviderVdcSpecificationType } from "./VMWVdcTemplateProviderVdcSpecificationType";
export declare class VMWVdcTemplateType extends EntityType {
    tenantName?: string;
    tenantDescription?: string;
    providerVdcReference?: VMWVdcTemplateProviderVdcSpecificationType[];
    vdcTemplateSpecification?: VMWVdcTemplateSpecificationType;
}
export declare namespace VMWVdcTemplateType {
    class Fields extends EntityType.Fields {
        static readonly TENANT_NAME: "tenantName";
        static readonly TENANT_DESCRIPTION: "tenantDescription";
        static readonly PROVIDER_VDC_REFERENCE: "providerVdcReference";
        static readonly VDC_TEMPLATE_SPECIFICATION: "vdcTemplateSpecification";
    }
}

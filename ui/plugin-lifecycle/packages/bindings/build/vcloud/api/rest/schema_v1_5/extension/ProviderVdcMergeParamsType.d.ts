import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class ProviderVdcMergeParamsType extends ResourceType {
    providerVdcReference?: ReferenceType[];
}
export declare namespace ProviderVdcMergeParamsType {
    class Fields extends ResourceType.Fields {
        static readonly PROVIDER_VDC_REFERENCE: "providerVdcReference";
    }
}

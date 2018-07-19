import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWProviderVdcReferencesType extends ResourceType {
    providerVdcReference?: ReferenceType[];
}
export declare namespace VMWProviderVdcReferencesType {
    class Fields extends ResourceType.Fields {
        static readonly PROVIDER_VDC_REFERENCE: "providerVdcReference";
    }
}

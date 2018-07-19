import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class ProviderVdcReferencesType extends VCloudExtensibleType {
    providerVdcReference?: ReferenceType[];
}
export declare namespace ProviderVdcReferencesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly PROVIDER_VDC_REFERENCE: "providerVdcReference";
    }
}

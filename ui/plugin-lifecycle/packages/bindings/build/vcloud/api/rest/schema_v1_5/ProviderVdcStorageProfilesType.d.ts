import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class ProviderVdcStorageProfilesType extends VCloudExtensibleType {
    providerVdcStorageProfile?: ReferenceType[];
}
export declare namespace ProviderVdcStorageProfilesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly PROVIDER_VDC_STORAGE_PROFILE: "providerVdcStorageProfile";
    }
}

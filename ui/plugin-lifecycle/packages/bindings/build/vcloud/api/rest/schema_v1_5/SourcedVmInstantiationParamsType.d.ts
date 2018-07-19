import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { LocalityParamsType } from "./LocalityParamsType";
import { InstantiateVmHardwareCustomizationParamsType } from "./InstantiateVmHardwareCustomizationParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class SourcedVmInstantiationParamsType extends VCloudExtensibleType {
    source?: ReferenceType;
    storageProfile?: ReferenceType;
    localityParams?: LocalityParamsType;
    hardwareCustomization?: InstantiateVmHardwareCustomizationParamsType;
}
export declare namespace SourcedVmInstantiationParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SOURCE: "source";
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly LOCALITY_PARAMS: "localityParams";
        static readonly HARDWARE_CUSTOMIZATION: "hardwareCustomization";
    }
}

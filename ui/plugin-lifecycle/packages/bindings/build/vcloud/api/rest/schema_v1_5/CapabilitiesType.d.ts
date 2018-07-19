import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { SupportedHardwareVersionsType } from "./SupportedHardwareVersionsType";
export declare class CapabilitiesType extends VCloudExtensibleType {
    supportedHardwareVersions?: SupportedHardwareVersionsType;
}
export declare namespace CapabilitiesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SUPPORTED_HARDWARE_VERSIONS: "supportedHardwareVersions";
    }
}

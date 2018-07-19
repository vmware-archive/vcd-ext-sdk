import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { SupportedHardwareVersionType } from "./SupportedHardwareVersionType";
export declare class SupportedHardwareVersionsType extends VCloudExtensibleType {
    supportedHardwareVersion?: SupportedHardwareVersionType[];
}
export declare namespace SupportedHardwareVersionsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly SUPPORTED_HARDWARE_VERSION: "supportedHardwareVersion";
    }
}

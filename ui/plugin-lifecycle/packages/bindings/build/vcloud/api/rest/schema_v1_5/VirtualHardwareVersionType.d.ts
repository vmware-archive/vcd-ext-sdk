import { IdentifiableResourceType } from "./IdentifiableResourceType";
import { HardDiskAdapterType } from "./HardDiskAdapterType";
import { SupportedOperatingSystemsInfoType } from "./SupportedOperatingSystemsInfoType";
export declare class VirtualHardwareVersionType extends IdentifiableResourceType {
    name?: string;
    maxCoresPerSocket?: number;
    supportedOperatingSystems?: SupportedOperatingSystemsInfoType;
    maxMemorySizeMb?: number;
    maxCPUs?: number;
    maxNICs?: number;
    supportsNestedHV?: boolean;
    supportsHotPlugPCI?: boolean;
    supportsHotAdd?: boolean;
    supportedMemorySizeGb?: number[];
    supportedCoresPerSocket?: number[];
    hardDiskAdapter?: HardDiskAdapterType[];
}
export declare namespace VirtualHardwareVersionType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly NAME: "name";
        static readonly MAX_CORES_PER_SOCKET: "maxCoresPerSocket";
        static readonly SUPPORTED_OPERATING_SYSTEMS: "supportedOperatingSystems";
        static readonly MAX_MEMORY_SIZE_MB: "maxMemorySizeMb";
        static readonly MAX_CP_US: "maxCPUs";
        static readonly MAX_NI_CS: "maxNICs";
        static readonly SUPPORTS_NESTED_HV: "supportsNestedHV";
        static readonly SUPPORTS_HOT_PLUG_PC_I: "supportsHotPlugPCI";
        static readonly SUPPORTS_HOT_ADD: "supportsHotAdd";
        static readonly SUPPORTED_MEMORY_SIZE_GB: "supportedMemorySizeGb";
        static readonly SUPPORTED_CORES_PER_SOCKET: "supportedCoresPerSocket";
        static readonly HARD_DISK_ADAPTER: "hardDiskAdapter";
    }
}

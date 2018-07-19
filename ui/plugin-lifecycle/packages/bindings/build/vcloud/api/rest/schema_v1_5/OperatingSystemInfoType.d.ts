import { NICType } from "./NICType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { HardDiskAdapterReferenceType } from "./HardDiskAdapterReferenceType";
import { DefaultHardDiskAdapterTypeType } from "./DefaultHardDiskAdapterTypeType";
export declare class OperatingSystemInfoType extends VCloudExtensibleType {
    operatingSystemId?: number;
    defaultHardDiskAdapterType?: DefaultHardDiskAdapterTypeType;
    supportedHardDiskAdapter?: HardDiskAdapterReferenceType[];
    minimumHardDiskSizeGigabytes?: number;
    minimumMemoryMegabytes?: number;
    name?: string;
    internalName?: string;
    supported?: boolean;
    x64?: boolean;
    maximumCpuCount?: number;
    maximumCoresPerSocket?: number;
    maximumSocketCount?: number;
    minimumHardwareVersion?: number;
    personalizationEnabled?: boolean;
    personalizationAuto?: boolean;
    sysprepPackagingSupported?: boolean;
    supportsMemHotAdd?: boolean;
    cimOsId?: number;
    cimVersion?: number;
    supportedForCreate?: boolean;
    recommendedNIC?: NICType;
    supportedNICType?: NICType[];
}
export declare namespace OperatingSystemInfoType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly OPERATING_SYSTEM_ID: "operatingSystemId";
        static readonly DEFAULT_HARD_DISK_ADAPTER_TYPE: "defaultHardDiskAdapterType";
        static readonly SUPPORTED_HARD_DISK_ADAPTER: "supportedHardDiskAdapter";
        static readonly MINIMUM_HARD_DISK_SIZE_GIGABYTES: "minimumHardDiskSizeGigabytes";
        static readonly MINIMUM_MEMORY_MEGABYTES: "minimumMemoryMegabytes";
        static readonly NAME: "name";
        static readonly INTERNAL_NAME: "internalName";
        static readonly SUPPORTED: "supported";
        static readonly X64: "x64";
        static readonly MAXIMUM_CPU_COUNT: "maximumCpuCount";
        static readonly MAXIMUM_CORES_PER_SOCKET: "maximumCoresPerSocket";
        static readonly MAXIMUM_SOCKET_COUNT: "maximumSocketCount";
        static readonly MINIMUM_HARDWARE_VERSION: "minimumHardwareVersion";
        static readonly PERSONALIZATION_ENABLED: "personalizationEnabled";
        static readonly PERSONALIZATION_AUTO: "personalizationAuto";
        static readonly SYSPREP_PACKAGING_SUPPORTED: "sysprepPackagingSupported";
        static readonly SUPPORTS_MEM_HOT_ADD: "supportsMemHotAdd";
        static readonly CIM_OS_ID: "cimOsId";
        static readonly CIM_VERSION: "cimVersion";
        static readonly SUPPORTED_FOR_CREATE: "supportedForCreate";
        static readonly RECOMMENDED_NI_C: "recommendedNIC";
        static readonly SUPPORTED_NI_CTYPE: "supportedNICType";
    }
}

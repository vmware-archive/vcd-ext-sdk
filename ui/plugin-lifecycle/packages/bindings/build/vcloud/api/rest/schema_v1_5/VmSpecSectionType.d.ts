import { SectionType } from "./../schema/ovf/SectionType";
import { DiskSectionType } from "./DiskSectionType";
import { VirtualCpuTypeType } from "./VirtualCpuTypeType";
import { ComputeResourceType } from "./ComputeResourceType";
import { MediaSectionType } from "./MediaSectionType";
import { HardwareVersionType } from "./HardwareVersionType";
export declare class VmSpecSectionType extends SectionType {
    osType?: string;
    numCpus?: number;
    numCoresPerSocket?: number;
    cpuResourceMhz?: ComputeResourceType;
    memoryResourceMb?: ComputeResourceType;
    mediaSection?: MediaSectionType;
    diskSection?: DiskSectionType;
    hardwareVersion?: HardwareVersionType;
    vmToolsVersion?: string;
    toolsGuestOsId?: string;
    virtualCpuType?: VirtualCpuTypeType;
    timeSyncWithHost?: boolean;
    modified?: boolean;
}
export declare namespace VmSpecSectionType {
    class Fields extends SectionType.Fields {
        static readonly OS_TYPE: "osType";
        static readonly NUM_CPUS: "numCpus";
        static readonly NUM_CORES_PER_SOCKET: "numCoresPerSocket";
        static readonly CPU_RESOURCE_MHZ: "cpuResourceMhz";
        static readonly MEMORY_RESOURCE_MB: "memoryResourceMb";
        static readonly MEDIA_SECTION: "mediaSection";
        static readonly DISK_SECTION: "diskSection";
        static readonly HARDWARE_VERSION: "hardwareVersion";
        static readonly VM_TOOLS_VERSION: "vmToolsVersion";
        static readonly TOOLS_GUEST_OS_ID: "toolsGuestOsId";
        static readonly VIRTUAL_CPU_TYPE: "virtualCpuType";
        static readonly TIME_SYNC_WITH_HOST: "timeSyncWithHost";
        static readonly MODIFIED: "modified";
    }
}

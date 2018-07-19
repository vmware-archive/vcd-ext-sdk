import { ResourceType } from "./../ResourceType";
export declare class LicenseMetricsInfoType extends ResourceType {
    vram?: number;
    vcpu?: number;
    runningVMs?: number;
    physicalMemoryUsed?: number;
    physicalSocketCount?: number;
    availablePhysicalMemory?: number;
    lastUpdate?: Date;
    publishingToRemoteSites?: boolean;
    subscribingToRemoteSites?: boolean;
}
export declare namespace LicenseMetricsInfoType {
    class Fields extends ResourceType.Fields {
        static readonly VRAM: "vram";
        static readonly VCPU: "vcpu";
        static readonly RUNNING_VMS: "runningVMs";
        static readonly PHYSICAL_MEMORY_USED: "physicalMemoryUsed";
        static readonly PHYSICAL_SOCKET_COUNT: "physicalSocketCount";
        static readonly AVAILABLE_PHYSICAL_MEMORY: "availablePhysicalMemory";
        static readonly LAST_UPDATE: "lastUpdate";
        static readonly PUBLISHING_TO_REMOTE_SITES: "publishingToRemoteSites";
        static readonly SUBSCRIBING_TO_REMOTE_SITES: "subscribingToRemoteSites";
    }
}

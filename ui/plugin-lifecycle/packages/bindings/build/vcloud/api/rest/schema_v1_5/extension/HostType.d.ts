import { EntityType } from "./../EntityType";
export declare class HostType extends EntityType {
    ready?: boolean;
    available?: boolean;
    enabled?: boolean;
    busy?: boolean;
    enableHostForHostSpanning?: boolean;
    cpuType?: string;
    numOfCpusPackages?: number;
    numOfCpusLogical?: number;
    cpuTotal?: number;
    memUsed?: number;
    memTotal?: number;
    hostOsName?: string;
    hostOsVersion?: string;
    systemMessages?: string;
    vimPropertyPageUrl?: string;
    vmMoRef?: string;
}
export declare namespace HostType {
    class Fields extends EntityType.Fields {
        static readonly READY: "ready";
        static readonly AVAILABLE: "available";
        static readonly ENABLED: "enabled";
        static readonly BUSY: "busy";
        static readonly ENABLE_HOST_FOR_HOST_SPANNING: "enableHostForHostSpanning";
        static readonly CPU_TYPE: "cpuType";
        static readonly NUM_OF_CPUS_PACKAGES: "numOfCpusPackages";
        static readonly NUM_OF_CPUS_LOGICAL: "numOfCpusLogical";
        static readonly CPU_TOTAL: "cpuTotal";
        static readonly MEM_USED: "memUsed";
        static readonly MEM_TOTAL: "memTotal";
        static readonly HOST_OS_NAME: "hostOsName";
        static readonly HOST_OS_VERSION: "hostOsVersion";
        static readonly SYSTEM_MESSAGES: "systemMessages";
        static readonly VIM_PROPERTY_PAGE_URL: "vimPropertyPageUrl";
        static readonly VM_MO_REF: "vmMoRef";
    }
}

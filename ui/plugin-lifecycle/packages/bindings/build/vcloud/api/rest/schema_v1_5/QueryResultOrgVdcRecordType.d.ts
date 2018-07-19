import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultOrgVdcRecordType extends QueryResultRecordType {
    cpuAllocationMhz?: number;
    cpuLimitMhz?: number;
    cpuReservedMhz?: number;
    cpuUsedMhz?: number;
    description?: string;
    isBusy?: boolean;
    isEnabled?: boolean;
    isSystemVdc?: boolean;
    memoryAllocationMB?: number;
    memoryLimitMB?: number;
    memoryReservedMB?: number;
    memoryUsedMB?: number;
    name?: string;
    networkPoolUniversalId?: string;
    numberOfDatastores?: number;
    numberOfDeployedVApps?: number;
    numberOfDisks?: number;
    numberOfMedia?: number;
    numberOfRunningVMs?: number;
    numberOfStorageProfiles?: number;
    numberOfVAppTemplates?: number;
    numberOfVApps?: number;
    numberOfVMs?: number;
    orgName?: string;
    providerVdc?: string;
    providerVdcName?: string;
    status?: string;
    storageAllocationMB?: number;
    storageLimitMB?: number;
    storageUsedMB?: number;
}
export declare namespace QueryResultOrgVdcRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly CPU_LIMIT_MHZ: "cpuLimitMhz";
        static readonly CPU_RESERVED_MHZ: "cpuReservedMhz";
        static readonly CPU_USED_MHZ: "cpuUsedMhz";
        static readonly DESCRIPTION: "description";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_SYSTEM_VDC: "isSystemVdc";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
        static readonly MEMORY_LIMIT_MB: "memoryLimitMB";
        static readonly MEMORY_RESERVED_MB: "memoryReservedMB";
        static readonly MEMORY_USED_MB: "memoryUsedMB";
        static readonly NAME: "name";
        static readonly NETWORK_POOL_UNIVERSAL_ID: "networkPoolUniversalId";
        static readonly NUMBER_OF_DATASTORES: "numberOfDatastores";
        static readonly NUMBER_OF_DEPLOYED_VAPPS: "numberOfDeployedVApps";
        static readonly NUMBER_OF_DISKS: "numberOfDisks";
        static readonly NUMBER_OF_MEDIA: "numberOfMedia";
        static readonly NUMBER_OF_RUNNING_VMS: "numberOfRunningVMs";
        static readonly NUMBER_OF_STORAGE_PROFILES: "numberOfStorageProfiles";
        static readonly NUMBER_OF_VAPP_TEMPLATES: "numberOfVAppTemplates";
        static readonly NUMBER_OF_VAPPS: "numberOfVApps";
        static readonly NUMBER_OF_VMS: "numberOfVMs";
        static readonly ORG_NAME: "orgName";
        static readonly PROVIDER_VDC: "providerVdc";
        static readonly PROVIDER_VDC_NAME: "providerVdcName";
        static readonly STATUS: "status";
        static readonly STORAGE_ALLOCATION_MB: "storageAllocationMB";
        static readonly STORAGE_LIMIT_MB: "storageLimitMB";
        static readonly STORAGE_USED_MB: "storageUsedMB";
    }
}

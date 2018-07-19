import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVMWProviderVdcRecordType extends QueryResultRecordType {
    cpuAllocationMhz?: number;
    cpuLimitMhz?: number;
    cpuUsedMhz?: number;
    isBusy?: boolean;
    isDeleted?: boolean;
    isEnabled?: boolean;
    memoryAllocationMB?: number;
    memoryLimitMB?: number;
    memoryUsedMB?: number;
    name?: string;
    numberOfDatastores?: number;
    numberOfStorageProfiles?: number;
    numberOfVdcs?: number;
    status?: string;
    storageAllocationMB?: number;
    storageLimitMB?: number;
    storageUsedMB?: number;
    vcpuRatingMhz?: number;
}
export declare namespace QueryResultVMWProviderVdcRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly CPU_LIMIT_MHZ: "cpuLimitMhz";
        static readonly CPU_USED_MHZ: "cpuUsedMhz";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_DELETED: "isDeleted";
        static readonly IS_ENABLED: "isEnabled";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
        static readonly MEMORY_LIMIT_MB: "memoryLimitMB";
        static readonly MEMORY_USED_MB: "memoryUsedMB";
        static readonly NAME: "name";
        static readonly NUMBER_OF_DATASTORES: "numberOfDatastores";
        static readonly NUMBER_OF_STORAGE_PROFILES: "numberOfStorageProfiles";
        static readonly NUMBER_OF_VDCS: "numberOfVdcs";
        static readonly STATUS: "status";
        static readonly STORAGE_ALLOCATION_MB: "storageAllocationMB";
        static readonly STORAGE_LIMIT_MB: "storageLimitMB";
        static readonly STORAGE_USED_MB: "storageUsedMB";
        static readonly VCPU_RATING_MHZ: "vcpuRatingMhz";
    }
}

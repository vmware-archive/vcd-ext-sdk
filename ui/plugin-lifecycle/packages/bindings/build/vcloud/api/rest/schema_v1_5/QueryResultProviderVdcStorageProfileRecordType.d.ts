import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultProviderVdcStorageProfileRecordType extends QueryResultRecordType {
    iopsAllocated?: number;
    iopsCapacity?: number;
    isEnabled?: boolean;
    name?: string;
    numberOfConditions?: number;
    providerVdc?: string;
    storageProfileMoref?: string;
    storageProvisionedMB?: number;
    storageRequestedMB?: number;
    storageTotalMB?: number;
    storageUsedMB?: number;
    vc?: string;
}
export declare namespace QueryResultProviderVdcStorageProfileRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IOPS_ALLOCATED: "iopsAllocated";
        static readonly IOPS_CAPACITY: "iopsCapacity";
        static readonly IS_ENABLED: "isEnabled";
        static readonly NAME: "name";
        static readonly NUMBER_OF_CONDITIONS: "numberOfConditions";
        static readonly PROVIDER_VDC: "providerVdc";
        static readonly STORAGE_PROFILE_MOREF: "storageProfileMoref";
        static readonly STORAGE_PROVISIONED_MB: "storageProvisionedMB";
        static readonly STORAGE_REQUESTED_MB: "storageRequestedMB";
        static readonly STORAGE_TOTAL_MB: "storageTotalMB";
        static readonly STORAGE_USED_MB: "storageUsedMB";
        static readonly VC: "vc";
    }
}

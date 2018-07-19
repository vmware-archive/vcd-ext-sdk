import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultOrgVdcStorageProfileRecordType extends QueryResultRecordType {
    iopsAllocated?: number;
    iopsLimit?: number;
    isDefaultStorageProfile?: boolean;
    isEnabled?: boolean;
    isVdcBusy?: boolean;
    name?: string;
    numberOfConditions?: number;
    storageLimitMB?: number;
    storageUsedMB?: number;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultOrgVdcStorageProfileRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IOPS_ALLOCATED: "iopsAllocated";
        static readonly IOPS_LIMIT: "iopsLimit";
        static readonly IS_DEFAULT_STORAGE_PROFILE: "isDefaultStorageProfile";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_VDC_BUSY: "isVdcBusy";
        static readonly NAME: "name";
        static readonly NUMBER_OF_CONDITIONS: "numberOfConditions";
        static readonly STORAGE_LIMIT_MB: "storageLimitMB";
        static readonly STORAGE_USED_MB: "storageUsedMB";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}

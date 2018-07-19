import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminOrgVdcStorageProfileRecordType extends QueryResultRecordType {
    iopsAllocated?: number;
    iopsLimit?: number;
    isDefaultStorageProfile?: boolean;
    isEnabled?: boolean;
    name?: string;
    numberOfConditions?: number;
    org?: string;
    storageLimitMB?: number;
    storageProfileMoref?: string;
    storageUsedMB?: number;
    vc?: string;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultAdminOrgVdcStorageProfileRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IOPS_ALLOCATED: "iopsAllocated";
        static readonly IOPS_LIMIT: "iopsLimit";
        static readonly IS_DEFAULT_STORAGE_PROFILE: "isDefaultStorageProfile";
        static readonly IS_ENABLED: "isEnabled";
        static readonly NAME: "name";
        static readonly NUMBER_OF_CONDITIONS: "numberOfConditions";
        static readonly ORG: "org";
        static readonly STORAGE_LIMIT_MB: "storageLimitMB";
        static readonly STORAGE_PROFILE_MOREF: "storageProfileMoref";
        static readonly STORAGE_USED_MB: "storageUsedMB";
        static readonly VC: "vc";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultDatastoreRecordType extends QueryResultRecordType {
    datastoreType?: string;
    iopsAllocated?: number;
    iopsCapacity?: number;
    isDeleted?: boolean;
    isEnabled?: boolean;
    moref?: string;
    name?: string;
    numberOfProviderVdcs?: number;
    provisionedStorageMB?: number;
    requestedStorageMB?: number;
    storageMB?: number;
    storageUsedMB?: number;
    vc?: string;
    vcName?: string;
}
export declare namespace QueryResultDatastoreRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DATASTORE_TYPE: "datastoreType";
        static readonly IOPS_ALLOCATED: "iopsAllocated";
        static readonly IOPS_CAPACITY: "iopsCapacity";
        static readonly IS_DELETED: "isDeleted";
        static readonly IS_ENABLED: "isEnabled";
        static readonly MOREF: "moref";
        static readonly NAME: "name";
        static readonly NUMBER_OF_PROVIDER_VDCS: "numberOfProviderVdcs";
        static readonly PROVISIONED_STORAGE_MB: "provisionedStorageMB";
        static readonly REQUESTED_STORAGE_MB: "requestedStorageMB";
        static readonly STORAGE_MB: "storageMB";
        static readonly STORAGE_USED_MB: "storageUsedMB";
        static readonly VC: "vc";
        static readonly VC_NAME: "vcName";
    }
}

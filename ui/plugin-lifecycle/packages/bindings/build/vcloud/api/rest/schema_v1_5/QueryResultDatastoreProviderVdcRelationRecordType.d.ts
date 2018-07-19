import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultDatastoreProviderVdcRelationRecordType extends QueryResultRecordType {
    datastore?: string;
    datastoreType?: string;
    isDeleted?: boolean;
    isEnabled?: boolean;
    moref?: string;
    name?: string;
    providerVdc?: string;
    provisionedStorageMB?: number;
    requestedStorageMB?: number;
    storageMB?: number;
    storageUsedMB?: number;
    vc?: string;
    vcName?: string;
}
export declare namespace QueryResultDatastoreProviderVdcRelationRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DATASTORE: "datastore";
        static readonly DATASTORE_TYPE: "datastoreType";
        static readonly IS_DELETED: "isDeleted";
        static readonly IS_ENABLED: "isEnabled";
        static readonly MOREF: "moref";
        static readonly NAME: "name";
        static readonly PROVIDER_VDC: "providerVdc";
        static readonly PROVISIONED_STORAGE_MB: "provisionedStorageMB";
        static readonly REQUESTED_STORAGE_MB: "requestedStorageMB";
        static readonly STORAGE_MB: "storageMB";
        static readonly STORAGE_USED_MB: "storageUsedMB";
        static readonly VC: "vc";
        static readonly VC_NAME: "vcName";
    }
}

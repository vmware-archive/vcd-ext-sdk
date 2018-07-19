import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultMediaRecordType extends QueryResultRecordType {
    catalog?: string;
    catalogItem?: string;
    catalogName?: string;
    creationDate?: Date;
    isBusy?: boolean;
    isPublished?: boolean;
    lastSuccessfulSync?: Date;
    name?: string;
    org?: string;
    owner?: string;
    ownerName?: string;
    status?: string;
    storageB?: number;
    storageProfileName?: string;
    vdc?: string;
    vdcName?: string;
    version?: number;
}
export declare namespace QueryResultMediaRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CATALOG: "catalog";
        static readonly CATALOG_ITEM: "catalogItem";
        static readonly CATALOG_NAME: "catalogName";
        static readonly CREATION_DATE: "creationDate";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly LAST_SUCCESSFUL_SYNC: "lastSuccessfulSync";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly STORAGE_B: "storageB";
        static readonly STORAGE_PROFILE_NAME: "storageProfileName";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
        static readonly VERSION: "version";
    }
}

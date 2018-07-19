import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVAppTemplateRecordType extends QueryResultRecordType {
    catalogName?: string;
    creationDate?: Date;
    description?: string;
    isBusy?: boolean;
    isDeployed?: boolean;
    isEnabled?: boolean;
    isExpired?: boolean;
    isGoldMaster?: boolean;
    isPublished?: boolean;
    lastSuccessfulSync?: Date;
    name?: string;
    org?: string;
    ownerName?: string;
    status?: string;
    storageProfileName?: string;
    vdc?: string;
    vdcName?: string;
    version?: number;
}
export declare namespace QueryResultVAppTemplateRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CATALOG_NAME: "catalogName";
        static readonly CREATION_DATE: "creationDate";
        static readonly DESCRIPTION: "description";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_DEPLOYED: "isDeployed";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_EXPIRED: "isExpired";
        static readonly IS_GOLD_MASTER: "isGoldMaster";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly LAST_SUCCESSFUL_SYNC: "lastSuccessfulSync";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly STORAGE_PROFILE_NAME: "storageProfileName";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
        static readonly VERSION: "version";
    }
}

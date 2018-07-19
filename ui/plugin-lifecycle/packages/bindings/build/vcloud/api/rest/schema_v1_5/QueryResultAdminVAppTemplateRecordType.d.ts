import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminVAppTemplateRecordType extends QueryResultRecordType {
    catalog?: string;
    catalogItem?: string;
    catalogName?: string;
    creationDate?: Date;
    isBusy?: boolean;
    isDeployed?: boolean;
    isEnabled?: boolean;
    isExpired?: boolean;
    isGoldMaster?: boolean;
    isPublished?: boolean;
    isVdcEnabled?: boolean;
    name?: string;
    org?: string;
    owner?: string;
    ownerName?: string;
    status?: string;
    storageProfileName?: string;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultAdminVAppTemplateRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CATALOG: "catalog";
        static readonly CATALOG_ITEM: "catalogItem";
        static readonly CATALOG_NAME: "catalogName";
        static readonly CREATION_DATE: "creationDate";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_DEPLOYED: "isDeployed";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_EXPIRED: "isExpired";
        static readonly IS_GOLD_MASTER: "isGoldMaster";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly IS_VDC_ENABLED: "isVdcEnabled";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly STORAGE_PROFILE_NAME: "storageProfileName";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}

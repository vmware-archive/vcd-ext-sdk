import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminCatalogItemRecordType extends QueryResultRecordType {
    catalog?: string;
    catalogName?: string;
    creationDate?: Date;
    entity?: string;
    entityName?: string;
    entityType?: string;
    isExpired?: boolean;
    isPublished?: boolean;
    isVdcEnabled?: boolean;
    name?: string;
    org?: string;
    owner?: string;
    ownerName?: string;
    status?: string;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultAdminCatalogItemRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CATALOG: "catalog";
        static readonly CATALOG_NAME: "catalogName";
        static readonly CREATION_DATE: "creationDate";
        static readonly ENTITY: "entity";
        static readonly ENTITY_NAME: "entityName";
        static readonly ENTITY_TYPE: "entityType";
        static readonly IS_EXPIRED: "isExpired";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly IS_VDC_ENABLED: "isVdcEnabled";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultCatalogItemRecordType extends QueryResultRecordType {
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
    owner?: string;
    ownerName?: string;
    status?: string;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultCatalogItemRecordType {
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
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}

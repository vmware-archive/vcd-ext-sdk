import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminCatalogRecordType extends QueryResultRecordType {
    creationDate?: Date;
    isPublished?: boolean;
    isShared?: boolean;
    name?: string;
    numberOfMedia?: number;
    numberOfTemplates?: number;
    org?: string;
    orgName?: string;
    owner?: string;
    ownerName?: string;
}
export declare namespace QueryResultAdminCatalogRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CREATION_DATE: "creationDate";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly IS_SHARED: "isShared";
        static readonly NAME: "name";
        static readonly NUMBER_OF_MEDIA: "numberOfMedia";
        static readonly NUMBER_OF_TEMPLATES: "numberOfTemplates";
        static readonly ORG: "org";
        static readonly ORG_NAME: "orgName";
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
    }
}

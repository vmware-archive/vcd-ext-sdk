import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultCatalogRecordType extends QueryResultRecordType {
    creationDate?: Date;
    description?: string;
    isPublished?: boolean;
    isShared?: boolean;
    name?: string;
    numberOfMedia?: number;
    numberOfVAppTemplates?: number;
    orgName?: string;
    owner?: string;
    ownerName?: string;
    publishSubscriptionType?: string;
    status?: string;
    version?: number;
}
export declare namespace QueryResultCatalogRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CREATION_DATE: "creationDate";
        static readonly DESCRIPTION: "description";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly IS_SHARED: "isShared";
        static readonly NAME: "name";
        static readonly NUMBER_OF_MEDIA: "numberOfMedia";
        static readonly NUMBER_OF_VAPP_TEMPLATES: "numberOfVAppTemplates";
        static readonly ORG_NAME: "orgName";
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
        static readonly PUBLISH_SUBSCRIPTION_TYPE: "publishSubscriptionType";
        static readonly STATUS: "status";
        static readonly VERSION: "version";
    }
}

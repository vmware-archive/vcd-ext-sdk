import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultServiceResourceRecordType extends QueryResultRecordType {
    externalObjectId?: string;
    name?: string;
    org?: string;
    resourceClass?: string;
}
export declare namespace QueryResultServiceResourceRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly EXTERNAL_OBJECT_ID: "externalObjectId";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly RESOURCE_CLASS: "resourceClass";
    }
}

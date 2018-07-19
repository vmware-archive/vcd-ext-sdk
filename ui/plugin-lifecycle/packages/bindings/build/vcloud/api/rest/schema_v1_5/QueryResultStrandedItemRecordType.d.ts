import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultStrandedItemRecordType extends QueryResultRecordType {
    deletionDate?: Date;
    name?: string;
    numberOfPurgeAttempts?: number;
    parent?: string;
    parentName?: string;
    vimObjectType?: string;
}
export declare namespace QueryResultStrandedItemRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DELETION_DATE: "deletionDate";
        static readonly NAME: "name";
        static readonly NUMBER_OF_PURGE_ATTEMPTS: "numberOfPurgeAttempts";
        static readonly PARENT: "parent";
        static readonly PARENT_NAME: "parentName";
        static readonly VIM_OBJECT_TYPE: "vimObjectType";
    }
}

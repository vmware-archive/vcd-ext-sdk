import { ResourceType } from "./../ResourceType";
import { ReferenceType } from "./../ReferenceType";
export declare class DatastoresType extends ResourceType {
    datastore?: ReferenceType[];
}
export declare namespace DatastoresType {
    class Fields extends ResourceType.Fields {
        static readonly DATASTORE: "datastore";
    }
}

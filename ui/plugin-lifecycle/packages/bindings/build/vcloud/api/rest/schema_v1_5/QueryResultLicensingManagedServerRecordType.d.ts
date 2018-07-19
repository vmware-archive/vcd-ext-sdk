import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultLicensingManagedServerRecordType extends QueryResultRecordType {
    managedObjectReference?: string;
    memoryInstalled?: number;
    memoryUsed?: number;
    name?: string;
    observationDate?: Date;
    parentSampleId?: string;
    socketCount?: number;
    virtualCenterId?: string;
}
export declare namespace QueryResultLicensingManagedServerRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly MANAGED_OBJECT_REFERENCE: "managedObjectReference";
        static readonly MEMORY_INSTALLED: "memoryInstalled";
        static readonly MEMORY_USED: "memoryUsed";
        static readonly NAME: "name";
        static readonly OBSERVATION_DATE: "observationDate";
        static readonly PARENT_SAMPLE_ID: "parentSampleId";
        static readonly SOCKET_COUNT: "socketCount";
        static readonly VIRTUAL_CENTER_ID: "virtualCenterId";
    }
}

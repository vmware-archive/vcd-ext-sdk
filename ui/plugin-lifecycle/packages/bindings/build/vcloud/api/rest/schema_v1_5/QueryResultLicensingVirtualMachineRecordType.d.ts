import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultLicensingVirtualMachineRecordType extends QueryResultRecordType {
    managedObjectReference?: string;
    memory?: number;
    observationDate?: Date;
    parentSampleId?: string;
    virtualCenterId?: string;
    virtualCpuCount?: number;
}
export declare namespace QueryResultLicensingVirtualMachineRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly MANAGED_OBJECT_REFERENCE: "managedObjectReference";
        static readonly MEMORY: "memory";
        static readonly OBSERVATION_DATE: "observationDate";
        static readonly PARENT_SAMPLE_ID: "parentSampleId";
        static readonly VIRTUAL_CENTER_ID: "virtualCenterId";
        static readonly VIRTUAL_CPU_COUNT: "virtualCpuCount";
    }
}

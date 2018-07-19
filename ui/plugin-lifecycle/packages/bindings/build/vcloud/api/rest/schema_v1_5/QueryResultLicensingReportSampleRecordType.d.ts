import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultLicensingReportSampleRecordType extends QueryResultRecordType {
    allocatedVirtualMemory?: number;
    observationDate?: Date;
    parentReportId?: string;
    physicalMemoryUsed?: number;
    physicalSocketCount?: number;
    publishingToRemoteSites?: boolean;
    sampleId?: string;
    subscribingToRemoteSites?: boolean;
    totalPhysicalMemory?: number;
    virtualProcessorCount?: number;
    vmCount?: number;
}
export declare namespace QueryResultLicensingReportSampleRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly ALLOCATED_VIRTUAL_MEMORY: "allocatedVirtualMemory";
        static readonly OBSERVATION_DATE: "observationDate";
        static readonly PARENT_REPORT_ID: "parentReportId";
        static readonly PHYSICAL_MEMORY_USED: "physicalMemoryUsed";
        static readonly PHYSICAL_SOCKET_COUNT: "physicalSocketCount";
        static readonly PUBLISHING_TO_REMOTE_SITES: "publishingToRemoteSites";
        static readonly SAMPLE_ID: "sampleId";
        static readonly SUBSCRIBING_TO_REMOTE_SITES: "subscribingToRemoteSites";
        static readonly TOTAL_PHYSICAL_MEMORY: "totalPhysicalMemory";
        static readonly VIRTUAL_PROCESSOR_COUNT: "virtualProcessorCount";
        static readonly VM_COUNT: "vmCount";
    }
}

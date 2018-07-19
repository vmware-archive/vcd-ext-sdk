import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultProviderVdcResourcePoolRelationRecordType extends QueryResultRecordType {
    cpuReservationAllocationMhz?: number;
    cpuReservationLimitMhz?: number;
    isEnabled?: boolean;
    isPrimary?: boolean;
    memoryReservationAllocationMB?: number;
    memoryReservationLimitMB?: number;
    name?: string;
    numberOfVMs?: number;
    providerVdc?: string;
    resourcePoolMoref?: string;
    vc?: string;
    vcName?: string;
}
export declare namespace QueryResultProviderVdcResourcePoolRelationRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CPU_RESERVATION_ALLOCATION_MHZ: "cpuReservationAllocationMhz";
        static readonly CPU_RESERVATION_LIMIT_MHZ: "cpuReservationLimitMhz";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_PRIMARY: "isPrimary";
        static readonly MEMORY_RESERVATION_ALLOCATION_MB: "memoryReservationAllocationMB";
        static readonly MEMORY_RESERVATION_LIMIT_MB: "memoryReservationLimitMB";
        static readonly NAME: "name";
        static readonly NUMBER_OF_VMS: "numberOfVMs";
        static readonly PROVIDER_VDC: "providerVdc";
        static readonly RESOURCE_POOL_MOREF: "resourcePoolMoref";
        static readonly VC: "vc";
        static readonly VC_NAME: "vcName";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminVAppRecordType extends QueryResultRecordType {
    cpuAllocationMhz?: number;
    creationDate?: Date;
    isAutoNature?: boolean;
    isBusy?: boolean;
    isDeployed?: boolean;
    isEnabled?: boolean;
    isExpired?: boolean;
    isInMaintenanceMode?: boolean;
    isVdcEnabled?: boolean;
    memoryAllocationMB?: number;
    name?: string;
    numberOfVMs?: number;
    org?: string;
    ownerName?: string;
    status?: string;
    storageKB?: number;
    vdc?: string;
    vdcName?: string;
}
export declare namespace QueryResultAdminVAppRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly CREATION_DATE: "creationDate";
        static readonly IS_AUTO_NATURE: "isAutoNature";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_DEPLOYED: "isDeployed";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_EXPIRED: "isExpired";
        static readonly IS_IN_MAINTENANCE_MODE: "isInMaintenanceMode";
        static readonly IS_VDC_ENABLED: "isVdcEnabled";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
        static readonly NAME: "name";
        static readonly NUMBER_OF_VMS: "numberOfVMs";
        static readonly ORG: "org";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly STORAGE_KB: "storageKB";
        static readonly VDC: "vdc";
        static readonly VDC_NAME: "vdcName";
    }
}

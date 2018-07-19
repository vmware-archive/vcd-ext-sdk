import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVMRecordType extends QueryResultRecordType {
    autoDeleteDate?: Date;
    autoUndeployDate?: Date;
    catalogName?: string;
    container?: string;
    containerName?: string;
    gcStatus?: string;
    guestOs?: string;
    hardwareVersion?: number;
    ipAddress?: string;
    isAutoDeleteNotified?: boolean;
    isAutoNature?: boolean;
    isAutoUndeployNotified?: boolean;
    isBusy?: boolean;
    isDeleted?: boolean;
    isDeployed?: boolean;
    isInMaintenanceMode?: boolean;
    isPublished?: boolean;
    isVAppTemplate?: boolean;
    memoryMB?: number;
    name?: string;
    network?: string;
    networkName?: string;
    numberOfCpus?: number;
    owner?: string;
    ownerName?: string;
    status?: string;
    storageProfileName?: string;
    vdc?: string;
    vmToolsStatus?: string;
}
export declare namespace QueryResultVMRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly AUTO_DELETE_DATE: "autoDeleteDate";
        static readonly AUTO_UNDEPLOY_DATE: "autoUndeployDate";
        static readonly CATALOG_NAME: "catalogName";
        static readonly CONTAINER: "container";
        static readonly CONTAINER_NAME: "containerName";
        static readonly GC_STATUS: "gcStatus";
        static readonly GUEST_OS: "guestOs";
        static readonly HARDWARE_VERSION: "hardwareVersion";
        static readonly IP_ADDRESS: "ipAddress";
        static readonly IS_AUTO_DELETE_NOTIFIED: "isAutoDeleteNotified";
        static readonly IS_AUTO_NATURE: "isAutoNature";
        static readonly IS_AUTO_UNDEPLOY_NOTIFIED: "isAutoUndeployNotified";
        static readonly IS_BUSY: "isBusy";
        static readonly IS_DELETED: "isDeleted";
        static readonly IS_DEPLOYED: "isDeployed";
        static readonly IS_IN_MAINTENANCE_MODE: "isInMaintenanceMode";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly IS_VAPP_TEMPLATE: "isVAppTemplate";
        static readonly MEMORY_MB: "memoryMB";
        static readonly NAME: "name";
        static readonly NETWORK: "network";
        static readonly NETWORK_NAME: "networkName";
        static readonly NUMBER_OF_CPUS: "numberOfCpus";
        static readonly OWNER: "owner";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
        static readonly STORAGE_PROFILE_NAME: "storageProfileName";
        static readonly VDC: "vdc";
        static readonly VM_TOOLS_STATUS: "vmToolsStatus";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminVMRecordType extends QueryResultRecordType {
    catalogName?: string;
    container?: string;
    containerName?: string;
    datastoreName?: string;
    gcStatus?: string;
    guestOs?: string;
    hardwareVersion?: number;
    hostName?: string;
    isAutoNature?: boolean;
    isDeleted?: boolean;
    isDeployed?: boolean;
    isPublished?: boolean;
    isVAppTemplate?: boolean;
    isVdcEnabled?: boolean;
    memoryMB?: number;
    moref?: string;
    name?: string;
    networkName?: string;
    numberOfCpus?: number;
    org?: string;
    status?: string;
    storageProfileName?: string;
    vc?: string;
    vdc?: string;
    vmToolsVersion?: number;
}
export declare namespace QueryResultAdminVMRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CATALOG_NAME: "catalogName";
        static readonly CONTAINER: "container";
        static readonly CONTAINER_NAME: "containerName";
        static readonly DATASTORE_NAME: "datastoreName";
        static readonly GC_STATUS: "gcStatus";
        static readonly GUEST_OS: "guestOs";
        static readonly HARDWARE_VERSION: "hardwareVersion";
        static readonly HOST_NAME: "hostName";
        static readonly IS_AUTO_NATURE: "isAutoNature";
        static readonly IS_DELETED: "isDeleted";
        static readonly IS_DEPLOYED: "isDeployed";
        static readonly IS_PUBLISHED: "isPublished";
        static readonly IS_VAPP_TEMPLATE: "isVAppTemplate";
        static readonly IS_VDC_ENABLED: "isVdcEnabled";
        static readonly MEMORY_MB: "memoryMB";
        static readonly MOREF: "moref";
        static readonly NAME: "name";
        static readonly NETWORK_NAME: "networkName";
        static readonly NUMBER_OF_CPUS: "numberOfCpus";
        static readonly ORG: "org";
        static readonly STATUS: "status";
        static readonly STORAGE_PROFILE_NAME: "storageProfileName";
        static readonly VC: "vc";
        static readonly VDC: "vdc";
        static readonly VM_TOOLS_VERSION: "vmToolsVersion";
    }
}

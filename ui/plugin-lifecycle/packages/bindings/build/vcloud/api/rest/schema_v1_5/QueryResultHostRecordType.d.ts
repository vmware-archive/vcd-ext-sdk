import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultHostRecordType extends QueryResultRecordType {
    isBusy?: boolean;
    isCrossHostEnabled?: boolean;
    isDeleted?: boolean;
    isEnabled?: boolean;
    isHung?: boolean;
    isInMaintenanceMode?: boolean;
    isPendingUpgrade?: boolean;
    isPrepared?: boolean;
    isSupported?: boolean;
    name?: string;
    numberOfVMs?: number;
    osVersion?: string;
    state?: number;
    vc?: string;
    vcName?: string;
}
export declare namespace QueryResultHostRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IS_BUSY: "isBusy";
        static readonly IS_CROSS_HOST_ENABLED: "isCrossHostEnabled";
        static readonly IS_DELETED: "isDeleted";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_HUNG: "isHung";
        static readonly IS_IN_MAINTENANCE_MODE: "isInMaintenanceMode";
        static readonly IS_PENDING_UPGRADE: "isPendingUpgrade";
        static readonly IS_PREPARED: "isPrepared";
        static readonly IS_SUPPORTED: "isSupported";
        static readonly NAME: "name";
        static readonly NUMBER_OF_VMS: "numberOfVMs";
        static readonly OS_VERSION: "osVersion";
        static readonly STATE: "state";
        static readonly VC: "vc";
        static readonly VC_NAME: "vcName";
    }
}

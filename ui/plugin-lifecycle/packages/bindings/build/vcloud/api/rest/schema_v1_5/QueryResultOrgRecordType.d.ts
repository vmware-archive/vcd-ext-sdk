import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultOrgRecordType extends QueryResultRecordType {
    canPublishCatalogs?: boolean;
    deployedVMQuota?: number;
    displayName?: string;
    isEnabled?: boolean;
    isReadOnly?: boolean;
    name?: string;
    numberOfCatalogs?: number;
    numberOfDisks?: number;
    numberOfGroups?: number;
    numberOfVApps?: number;
    numberOfVdcs?: number;
    storedVMQuota?: number;
}
export declare namespace QueryResultOrgRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CAN_PUBLISH_CATALOGS: "canPublishCatalogs";
        static readonly DEPLOYED_VM_QUOTA: "deployedVMQuota";
        static readonly DISPLAY_NAME: "displayName";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_READ_ONLY: "isReadOnly";
        static readonly NAME: "name";
        static readonly NUMBER_OF_CATALOGS: "numberOfCatalogs";
        static readonly NUMBER_OF_DISKS: "numberOfDisks";
        static readonly NUMBER_OF_GROUPS: "numberOfGroups";
        static readonly NUMBER_OF_VAPPS: "numberOfVApps";
        static readonly NUMBER_OF_VDCS: "numberOfVdcs";
        static readonly STORED_VM_QUOTA: "storedVMQuota";
    }
}

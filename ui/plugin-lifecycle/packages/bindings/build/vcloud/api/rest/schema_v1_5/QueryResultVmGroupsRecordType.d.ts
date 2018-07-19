import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVmGroupsRecordType extends QueryResultRecordType {
    clusterMoref?: string;
    vcId?: string;
    vmGroupId?: string;
    vmGroupName?: string;
}
export declare namespace QueryResultVmGroupsRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CLUSTER_MOREF: "clusterMoref";
        static readonly VC_ID: "vcId";
        static readonly VM_GROUP_ID: "vmGroupId";
        static readonly VM_GROUP_NAME: "vmGroupName";
    }
}

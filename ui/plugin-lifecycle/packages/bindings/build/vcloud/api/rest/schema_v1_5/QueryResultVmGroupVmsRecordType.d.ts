import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVmGroupVmsRecordType extends QueryResultRecordType {
    clusterMoref?: string;
    isVappTemplate?: boolean;
    orgVdcId?: string;
    orgVdcName?: string;
    vappId?: string;
    vappName?: string;
    vcId?: string;
    vmGroupId?: string;
    vmGroupName?: string;
    vmMoref?: string;
    vmName?: string;
}
export declare namespace QueryResultVmGroupVmsRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CLUSTER_MOREF: "clusterMoref";
        static readonly IS_VAPP_TEMPLATE: "isVappTemplate";
        static readonly ORG_VDC_ID: "orgVdcId";
        static readonly ORG_VDC_NAME: "orgVdcName";
        static readonly VAPP_ID: "vappId";
        static readonly VAPP_NAME: "vappName";
        static readonly VC_ID: "vcId";
        static readonly VM_GROUP_ID: "vmGroupId";
        static readonly VM_GROUP_NAME: "vmGroupName";
        static readonly VM_MOREF: "vmMoref";
        static readonly VM_NAME: "vmName";
    }
}

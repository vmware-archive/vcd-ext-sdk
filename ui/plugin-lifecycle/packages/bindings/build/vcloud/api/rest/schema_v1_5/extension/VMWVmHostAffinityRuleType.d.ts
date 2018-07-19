import { AffinityRuleType } from "./../AffinityRuleType";
export declare class VMWVmHostAffinityRuleType extends AffinityRuleType {
    hostGroupName?: string;
    vmGroupName?: string;
}
export declare namespace VMWVmHostAffinityRuleType {
    class Fields extends AffinityRuleType.Fields {
        static readonly HOST_GROUP_NAME: "hostGroupName";
        static readonly VM_GROUP_NAME: "vmGroupName";
    }
}

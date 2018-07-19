import { ResourceType } from "./../ResourceType";
import { VMWVmHostAffinityRuleType } from "./VMWVmHostAffinityRuleType";
export declare class VMWVmHostAffinityRulesType extends ResourceType {
    vmHostAffinityRule?: VMWVmHostAffinityRuleType[];
}
export declare namespace VMWVmHostAffinityRulesType {
    class Fields extends ResourceType.Fields {
        static readonly VM_HOST_AFFINITY_RULE: "vmHostAffinityRule";
    }
}

import { ResourceType } from "./ResourceType";
import { VmAffinityRuleType } from "./VmAffinityRuleType";
export declare class VmAffinityRulesType extends ResourceType {
    vmAffinityRule?: VmAffinityRuleType[];
}
export declare namespace VmAffinityRulesType {
    class Fields extends ResourceType.Fields {
        static readonly VM_AFFINITY_RULE: "vmAffinityRule";
    }
}

import { AffinityRuleType } from "./AffinityRuleType";
import { VmsType } from "./VmsType";
export declare class VmAffinityRuleType extends AffinityRuleType {
    scope?: string;
    vmReferences?: VmsType;
}
export declare namespace VmAffinityRuleType {
    class Fields extends AffinityRuleType.Fields {
        static readonly SCOPE: "scope";
        static readonly VM_REFERENCES: "vmReferences";
    }
}

import { IdentifiableResourceType } from "./IdentifiableResourceType";
export declare abstract class AffinityRuleType extends IdentifiableResourceType {
    name?: string;
    isEnabled?: boolean;
    isMandatory?: boolean;
    polarity?: string;
}
export declare namespace AffinityRuleType {
    class Fields extends IdentifiableResourceType.Fields {
        static readonly NAME: "name";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_MANDATORY: "isMandatory";
        static readonly POLARITY: "polarity";
    }
}

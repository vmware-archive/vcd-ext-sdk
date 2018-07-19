import { VCloudExtensibleType } from "./../VCloudExtensibleType";
import { AclRuleType } from "./AclRuleType";
export declare class AclRulesType extends VCloudExtensibleType {
    aclRule?: AclRuleType[];
}
export declare namespace AclRulesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ACL_RULE: "aclRule";
    }
}

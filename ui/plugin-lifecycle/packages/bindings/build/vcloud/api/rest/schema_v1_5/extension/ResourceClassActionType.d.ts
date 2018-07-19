import { EntityType } from "./../EntityType";
import { AclRulesType } from "./AclRulesType";
export declare class ResourceClassActionType extends EntityType {
    httpMethod?: string;
    urlPattern?: string;
    aclRules?: AclRulesType;
}
export declare namespace ResourceClassActionType {
    class Fields extends EntityType.Fields {
        static readonly HTTP_METHOD: "httpMethod";
        static readonly URL_PATTERN: "urlPattern";
        static readonly ACL_RULES: "aclRules";
    }
}

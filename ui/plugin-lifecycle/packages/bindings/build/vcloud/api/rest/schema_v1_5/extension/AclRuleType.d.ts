import { EntityType } from "./../EntityType";
import { AclAccessType } from "./AclAccessType";
export declare class AclRuleType extends EntityType {
    serviceResourceAccess?: AclAccessType;
    organizationAccess?: AclAccessType;
    principalAccess?: AclAccessType;
}
export declare namespace AclRuleType {
    class Fields extends EntityType.Fields {
        static readonly SERVICE_RESOURCE_ACCESS: "serviceResourceAccess";
        static readonly ORGANIZATION_ACCESS: "organizationAccess";
        static readonly PRINCIPAL_ACCESS: "principalAccess";
    }
}

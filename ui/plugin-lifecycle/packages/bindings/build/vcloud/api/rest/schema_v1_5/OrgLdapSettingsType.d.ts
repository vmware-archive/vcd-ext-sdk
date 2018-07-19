import { ResourceType } from "./ResourceType";
import { CustomOrgLdapSettingsType } from "./CustomOrgLdapSettingsType";
export declare class OrgLdapSettingsType extends ResourceType {
    orgLdapMode?: string;
    customUsersOu?: string;
    customOrgLdapSettings?: CustomOrgLdapSettingsType;
}
export declare namespace OrgLdapSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly ORG_LDAP_MODE: "orgLdapMode";
        static readonly CUSTOM_USERS_OU: "customUsersOu";
        static readonly CUSTOM_ORG_LDAP_SETTINGS: "customOrgLdapSettings";
    }
}

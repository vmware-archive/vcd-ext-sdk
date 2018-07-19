import { OrgOperationLimitsSettingsType } from "./OrgOperationLimitsSettingsType";
import { OrgLeaseSettingsType } from "./OrgLeaseSettingsType";
import { OrgLdapSettingsType } from "./OrgLdapSettingsType";
import { ResourceType } from "./ResourceType";
import { OrgPasswordPolicySettingsType } from "./OrgPasswordPolicySettingsType";
import { OrgEmailSettingsType } from "./OrgEmailSettingsType";
import { OrgGeneralSettingsType } from "./OrgGeneralSettingsType";
import { OrgVAppTemplateLeaseSettingsType } from "./OrgVAppTemplateLeaseSettingsType";
import { OrgOAuthSettingsType } from "./OrgOAuthSettingsType";
import { OrgFederationSettingsType } from "./OrgFederationSettingsType";
export declare class OrgSettingsType extends ResourceType {
    orgGeneralSettings?: OrgGeneralSettingsType;
    vAppLeaseSettings?: OrgLeaseSettingsType;
    vAppTemplateLeaseSettings?: OrgVAppTemplateLeaseSettingsType;
    orgLdapSettings?: OrgLdapSettingsType;
    orgEmailSettings?: OrgEmailSettingsType;
    orgPasswordPolicySettings?: OrgPasswordPolicySettingsType;
    orgOperationLimitsSettings?: OrgOperationLimitsSettingsType;
    orgFederationSettings?: OrgFederationSettingsType;
    orgOAuthSettings?: OrgOAuthSettingsType;
}
export declare namespace OrgSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly ORG_GENERAL_SETTINGS: "orgGeneralSettings";
        static readonly V_APP_LEASE_SETTINGS: "vAppLeaseSettings";
        static readonly V_APP_TEMPLATE_LEASE_SETTINGS: "vAppTemplateLeaseSettings";
        static readonly ORG_LDAP_SETTINGS: "orgLdapSettings";
        static readonly ORG_EMAIL_SETTINGS: "orgEmailSettings";
        static readonly ORG_PASSWORD_POLICY_SETTINGS: "orgPasswordPolicySettings";
        static readonly ORG_OPERATION_LIMITS_SETTINGS: "orgOperationLimitsSettings";
        static readonly ORG_FEDERATION_SETTINGS: "orgFederationSettings";
        static readonly ORG_OAUTH_SETTINGS: "orgOAuthSettings";
    }
}

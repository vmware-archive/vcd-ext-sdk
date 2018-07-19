import { ResourceType } from "./../ResourceType";
import { LdapSettingsType } from "./LdapSettingsType";
import { SystemPasswordPolicySettingsType } from "./SystemPasswordPolicySettingsType";
import { LicenseType } from "./LicenseType";
import { LookupServiceSettingsType } from "./LookupServiceSettingsType";
import { EmailSettingsType } from "./EmailSettingsType";
import { KerberosSettingsType } from "./KerberosSettingsType";
import { OperationLimitsSettingsType } from "./OperationLimitsSettingsType";
import { GeneralSettingsType } from "./GeneralSettingsType";
import { BlockingTaskSettingsType } from "./BlockingTaskSettingsType";
import { BrandingSettingsType } from "./BrandingSettingsType";
import { CatalogSettingsType } from "./CatalogSettingsType";
import { NotificationsSettingsType } from "./NotificationsSettingsType";
import { AmqpSettingsType } from "./AmqpSettingsType";
export declare class SystemSettingsType extends ResourceType {
    generalSettings?: GeneralSettingsType;
    notificationsSettings?: NotificationsSettingsType;
    ldapSettings?: LdapSettingsType;
    amqpSettings?: AmqpSettingsType;
    emailSettings?: EmailSettingsType;
    license?: LicenseType;
    brandingSettings?: BrandingSettingsType;
    blockingTaskSettings?: BlockingTaskSettingsType;
    passwordPolicySettings?: SystemPasswordPolicySettingsType;
    kerberosSettings?: KerberosSettingsType;
    lookupServiceSettings?: LookupServiceSettingsType;
    catalogSettings?: CatalogSettingsType;
    operationLimitsSettings?: OperationLimitsSettingsType;
}
export declare namespace SystemSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly GENERAL_SETTINGS: "generalSettings";
        static readonly NOTIFICATIONS_SETTINGS: "notificationsSettings";
        static readonly LDAP_SETTINGS: "ldapSettings";
        static readonly AMQP_SETTINGS: "amqpSettings";
        static readonly EMAIL_SETTINGS: "emailSettings";
        static readonly LICENSE: "license";
        static readonly BRANDING_SETTINGS: "brandingSettings";
        static readonly BLOCKING_TASK_SETTINGS: "blockingTaskSettings";
        static readonly PASSWORD_POLICY_SETTINGS: "passwordPolicySettings";
        static readonly KERBEROS_SETTINGS: "kerberosSettings";
        static readonly LOOKUP_SERVICE_SETTINGS: "lookupServiceSettings";
        static readonly CATALOG_SETTINGS: "catalogSettings";
        static readonly OPERATION_LIMITS_SETTINGS: "operationLimitsSettings";
    }
}

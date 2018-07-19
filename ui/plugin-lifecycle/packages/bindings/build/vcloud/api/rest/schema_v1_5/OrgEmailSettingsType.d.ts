import { ResourceType } from "./ResourceType";
import { SmtpServerSettingsType } from "./SmtpServerSettingsType";
export declare class OrgEmailSettingsType extends ResourceType {
    isDefaultSmtpServer?: boolean;
    isDefaultOrgEmail?: boolean;
    fromEmailAddress?: string;
    defaultSubjectPrefix?: string;
    isAlertEmailToAllAdmins?: boolean;
    alertEmailTo?: string[];
    smtpServerSettings?: SmtpServerSettingsType;
}
export declare namespace OrgEmailSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly IS_DEFAULT_SMTP_SERVER: "isDefaultSmtpServer";
        static readonly IS_DEFAULT_ORG_EMAIL: "isDefaultOrgEmail";
        static readonly FROM_EMAIL_ADDRESS: "fromEmailAddress";
        static readonly DEFAULT_SUBJECT_PREFIX: "defaultSubjectPrefix";
        static readonly IS_ALERT_EMAIL_TO_ALL_ADMINS: "isAlertEmailToAllAdmins";
        static readonly ALERT_EMAIL_TO: "alertEmailTo";
        static readonly SMTP_SERVER_SETTINGS: "smtpServerSettings";
    }
}

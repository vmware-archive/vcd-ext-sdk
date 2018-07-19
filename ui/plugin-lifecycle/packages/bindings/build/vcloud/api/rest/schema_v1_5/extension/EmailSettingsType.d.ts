import { ResourceType } from "./../ResourceType";
import { SmtpSettingsType } from "./SmtpSettingsType";
export declare class EmailSettingsType extends ResourceType {
    senderEmailAddress?: string;
    emailSubjectPrefix?: string;
    alertEmailToAllAdmins?: boolean;
    alertEmailTo?: string;
    smtpSettings?: SmtpSettingsType;
}
export declare namespace EmailSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly SENDER_EMAIL_ADDRESS: "senderEmailAddress";
        static readonly EMAIL_SUBJECT_PREFIX: "emailSubjectPrefix";
        static readonly ALERT_EMAIL_TO_ALL_ADMINS: "alertEmailToAllAdmins";
        static readonly ALERT_EMAIL_TO: "alertEmailTo";
        static readonly SMTP_SETTINGS: "smtpSettings";
    }
}

import { ResourceType } from "./../ResourceType";
import { SmtpSecureModeType } from "./../SmtpSecureModeType";
export declare class SmtpSettingsType extends ResourceType {
    useAuthentication?: boolean;
    smtpServerName?: string;
    smtpServerPort?: number;
    ssl?: boolean;
    smtpSecureMode?: SmtpSecureModeType;
    sslTrustStore?: string;
    userName?: string;
    password?: string;
}
export declare namespace SmtpSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly USE_AUTHENTICATION: "useAuthentication";
        static readonly SMTP_SERVER_NAME: "smtpServerName";
        static readonly SMTP_SERVER_PORT: "smtpServerPort";
        static readonly SSL: "ssl";
        static readonly SMTP_SECURE_MODE: "smtpSecureMode";
        static readonly SSL_TRUST_STORE: "sslTrustStore";
        static readonly USER_NAME: "userName";
        static readonly PASSWORD: "password";
    }
}

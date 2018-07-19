import { SmtpSecureModeType } from "./SmtpSecureModeType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class SmtpServerSettingsType extends VCloudExtensibleType {
    isUseAuthentication?: boolean;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    smtpSecureMode?: SmtpSecureModeType;
    sslTrustStore?: string;
}
export declare namespace SmtpServerSettingsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly IS_USE_AUTHENTICATION: "isUseAuthentication";
        static readonly HOST: "host";
        static readonly PORT: "port";
        static readonly USERNAME: "username";
        static readonly PASSWORD: "password";
        static readonly SMTP_SECURE_MODE: "smtpSecureMode";
        static readonly SSL_TRUST_STORE: "sslTrustStore";
    }
}

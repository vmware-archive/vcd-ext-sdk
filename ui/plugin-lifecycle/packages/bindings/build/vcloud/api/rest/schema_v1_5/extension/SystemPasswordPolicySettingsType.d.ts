import { ResourceType } from "./../ResourceType";
export declare class SystemPasswordPolicySettingsType extends ResourceType {
    accountLockoutEnabled?: boolean;
    adminAccountLockoutEnabled?: boolean;
    invalidLoginsBeforeLockout?: number;
    accountLockoutIntervalMinutes?: number;
}
export declare namespace SystemPasswordPolicySettingsType {
    class Fields extends ResourceType.Fields {
        static readonly ACCOUNT_LOCKOUT_ENABLED: "accountLockoutEnabled";
        static readonly ADMIN_ACCOUNT_LOCKOUT_ENABLED: "adminAccountLockoutEnabled";
        static readonly INVALID_LOGINS_BEFORE_LOCKOUT: "invalidLoginsBeforeLockout";
        static readonly ACCOUNT_LOCKOUT_INTERVAL_MINUTES: "accountLockoutIntervalMinutes";
    }
}

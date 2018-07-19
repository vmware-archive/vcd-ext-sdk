import { ResourceType } from "./ResourceType";
export declare class OrgPasswordPolicySettingsType extends ResourceType {
    accountLockoutEnabled?: boolean;
    invalidLoginsBeforeLockout?: number;
    accountLockoutIntervalMinutes?: number;
}
export declare namespace OrgPasswordPolicySettingsType {
    class Fields extends ResourceType.Fields {
        static readonly ACCOUNT_LOCKOUT_ENABLED: "accountLockoutEnabled";
        static readonly INVALID_LOGINS_BEFORE_LOCKOUT: "invalidLoginsBeforeLockout";
        static readonly ACCOUNT_LOCKOUT_INTERVAL_MINUTES: "accountLockoutIntervalMinutes";
    }
}

import { GroupsListType } from "./GroupsListType";
import { EntityType } from "./EntityType";
import { ReferenceType } from "./ReferenceType";
export declare class UserType extends EntityType {
    fullName?: string;
    emailAddress?: string;
    telephone?: string;
    isEnabled?: boolean;
    isLocked?: boolean;
    im?: string;
    nameInSource?: string;
    isAlertEnabled?: boolean;
    alertEmailPrefix?: string;
    alertEmail?: string;
    isExternal?: boolean;
    providerType?: string;
    isDefaultCached?: boolean;
    isGroupRole?: boolean;
    storedVmQuota?: number;
    deployedVmQuota?: number;
    role?: ReferenceType;
    password?: string;
    groupReferences?: GroupsListType;
}
export declare namespace UserType {
    class Fields extends EntityType.Fields {
        static readonly FULL_NAME: "fullName";
        static readonly EMAIL_ADDRESS: "emailAddress";
        static readonly TELEPHONE: "telephone";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_LOCKED: "isLocked";
        static readonly IM: "im";
        static readonly NAME_IN_SOURCE: "nameInSource";
        static readonly IS_ALERT_ENABLED: "isAlertEnabled";
        static readonly ALERT_EMAIL_PREFIX: "alertEmailPrefix";
        static readonly ALERT_EMAIL: "alertEmail";
        static readonly IS_EXTERNAL: "isExternal";
        static readonly PROVIDER_TYPE: "providerType";
        static readonly IS_DEFAULT_CACHED: "isDefaultCached";
        static readonly IS_GROUP_ROLE: "isGroupRole";
        static readonly STORED_VM_QUOTA: "storedVmQuota";
        static readonly DEPLOYED_VM_QUOTA: "deployedVmQuota";
        static readonly ROLE: "role";
        static readonly PASSWORD: "password";
        static readonly GROUP_REFERENCES: "groupReferences";
    }
}

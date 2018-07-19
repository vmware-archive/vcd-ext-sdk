import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminUserRecordType extends QueryResultRecordType {
    deployedVMQuota?: number;
    deployedVMQuotaRank?: number;
    fullName?: string;
    identityProviderType?: string;
    isEnabled?: boolean;
    isLdapUser?: boolean;
    name?: string;
    numberOfDeployedVMs?: number;
    numberOfStoredVMs?: number;
    org?: string;
    storedVMQuota?: number;
    storedVMQuotaRank?: number;
}
export declare namespace QueryResultAdminUserRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DEPLOYED_VM_QUOTA: "deployedVMQuota";
        static readonly DEPLOYED_VM_QUOTA_RANK: "deployedVMQuotaRank";
        static readonly FULL_NAME: "fullName";
        static readonly IDENTITY_PROVIDER_TYPE: "identityProviderType";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_LDAP_USER: "isLdapUser";
        static readonly NAME: "name";
        static readonly NUMBER_OF_DEPLOYED_VMS: "numberOfDeployedVMs";
        static readonly NUMBER_OF_STORED_VMS: "numberOfStoredVMs";
        static readonly ORG: "org";
        static readonly STORED_VM_QUOTA: "storedVMQuota";
        static readonly STORED_VM_QUOTA_RANK: "storedVMQuotaRank";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultUserRecordType extends QueryResultRecordType {
    deployedVMQuota?: number;
    fullName?: string;
    identityProviderType?: string;
    isEnabled?: boolean;
    isLdapUser?: boolean;
    name?: string;
    numberOfDeployedVMs?: number;
    numberOfStoredVMs?: number;
    storedVMQuota?: number;
}
export declare namespace QueryResultUserRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DEPLOYED_VM_QUOTA: "deployedVMQuota";
        static readonly FULL_NAME: "fullName";
        static readonly IDENTITY_PROVIDER_TYPE: "identityProviderType";
        static readonly IS_ENABLED: "isEnabled";
        static readonly IS_LDAP_USER: "isLdapUser";
        static readonly NAME: "name";
        static readonly NUMBER_OF_DEPLOYED_VMS: "numberOfDeployedVMs";
        static readonly NUMBER_OF_STORED_VMS: "numberOfStoredVMs";
        static readonly STORED_VM_QUOTA: "storedVMQuota";
    }
}

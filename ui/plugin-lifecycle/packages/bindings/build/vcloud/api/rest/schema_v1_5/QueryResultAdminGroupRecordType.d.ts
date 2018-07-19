import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminGroupRecordType extends QueryResultRecordType {
    identityProviderType?: string;
    isReadOnly?: boolean;
    name?: string;
    org?: string;
    roleName?: string;
}
export declare namespace QueryResultAdminGroupRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IDENTITY_PROVIDER_TYPE: "identityProviderType";
        static readonly IS_READ_ONLY: "isReadOnly";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly ROLE_NAME: "roleName";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultGroupRecordType extends QueryResultRecordType {
    identityProviderType?: string;
    isReadOnly?: boolean;
    name?: string;
    roleName?: string;
}
export declare namespace QueryResultGroupRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IDENTITY_PROVIDER_TYPE: "identityProviderType";
        static readonly IS_READ_ONLY: "isReadOnly";
        static readonly NAME: "name";
        static readonly ROLE_NAME: "roleName";
    }
}

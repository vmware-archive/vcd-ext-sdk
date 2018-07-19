import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAclRuleRecordType extends QueryResultRecordType {
    name?: string;
    org?: string;
    orgAccess?: string;
    principal?: string;
    principalAccess?: string;
    principalType?: string;
    resourceClassAction?: string;
    serviceResource?: string;
    serviceResourceAccess?: string;
}
export declare namespace QueryResultAclRuleRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly ORG_ACCESS: "orgAccess";
        static readonly PRINCIPAL: "principal";
        static readonly PRINCIPAL_ACCESS: "principalAccess";
        static readonly PRINCIPAL_TYPE: "principalType";
        static readonly RESOURCE_CLASS_ACTION: "resourceClassAction";
        static readonly SERVICE_RESOURCE: "serviceResource";
        static readonly SERVICE_RESOURCE_ACCESS: "serviceResourceAccess";
    }
}

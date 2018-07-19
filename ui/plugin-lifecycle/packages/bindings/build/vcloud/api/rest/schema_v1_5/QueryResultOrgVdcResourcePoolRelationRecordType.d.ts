import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultOrgVdcResourcePoolRelationRecordType extends QueryResultRecordType {
    resourcePoolMoref?: string;
    vc?: string;
    vdc?: string;
}
export declare namespace QueryResultOrgVdcResourcePoolRelationRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly RESOURCE_POOL_MOREF: "resourcePoolMoref";
        static readonly VC: "vc";
        static readonly VDC: "vdc";
    }
}

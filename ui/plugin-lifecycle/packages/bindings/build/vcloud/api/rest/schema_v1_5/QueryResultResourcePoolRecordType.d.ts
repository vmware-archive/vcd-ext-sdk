import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultResourcePoolRecordType extends QueryResultRecordType {
    isDeleted?: boolean;
    moref?: string;
    name?: string;
    vc?: string;
    vcName?: string;
}
export declare namespace QueryResultResourcePoolRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IS_DELETED: "isDeleted";
        static readonly MOREF: "moref";
        static readonly NAME: "name";
        static readonly VC: "vc";
        static readonly VC_NAME: "vcName";
    }
}

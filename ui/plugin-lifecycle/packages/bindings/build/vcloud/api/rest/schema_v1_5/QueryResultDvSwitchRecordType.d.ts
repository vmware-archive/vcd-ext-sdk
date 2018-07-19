import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultDvSwitchRecordType extends QueryResultRecordType {
    isVCEnabled?: boolean;
    moref?: string;
    name?: string;
    vc?: string;
    vcName?: string;
}
export declare namespace QueryResultDvSwitchRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IS_VC_ENABLED: "isVCEnabled";
        static readonly MOREF: "moref";
        static readonly NAME: "name";
        static readonly VC: "vc";
        static readonly VC_NAME: "vcName";
    }
}

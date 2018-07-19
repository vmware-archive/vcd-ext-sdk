import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultPortgroupRecordType extends QueryResultRecordType {
    isVCEnabled?: boolean;
    moref?: string;
    name?: string;
    network?: string;
    networkName?: string;
    portgroupType?: string;
    scopeType?: number;
    vc?: string;
    vcName?: string;
}
export declare namespace QueryResultPortgroupRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IS_VC_ENABLED: "isVCEnabled";
        static readonly MOREF: "moref";
        static readonly NAME: "name";
        static readonly NETWORK: "network";
        static readonly NETWORK_NAME: "networkName";
        static readonly PORTGROUP_TYPE: "portgroupType";
        static readonly SCOPE_TYPE: "scopeType";
        static readonly VC: "vc";
        static readonly VC_NAME: "vcName";
    }
}

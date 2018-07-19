import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultNetworkPoolRecordType extends QueryResultRecordType {
    isBusy?: boolean;
    name?: string;
    networkPoolType?: number;
    universalId?: string;
}
export declare namespace QueryResultNetworkPoolRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IS_BUSY: "isBusy";
        static readonly NAME: "name";
        static readonly NETWORK_POOL_TYPE: "networkPoolType";
        static readonly UNIVERSAL_ID: "universalId";
    }
}

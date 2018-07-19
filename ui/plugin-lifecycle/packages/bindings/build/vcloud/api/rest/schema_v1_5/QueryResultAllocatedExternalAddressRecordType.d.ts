import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAllocatedExternalAddressRecordType extends QueryResultRecordType {
    ipAddress?: string;
    linkedNetwork?: string;
    network?: string;
}
export declare namespace QueryResultAllocatedExternalAddressRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IP_ADDRESS: "ipAddress";
        static readonly LINKED_NETWORK: "linkedNetwork";
        static readonly NETWORK: "network";
    }
}

import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultAdminAllocatedExternalAddressRecordType extends QueryResultRecordType {
    ipAddress?: string;
    linkedNetwork?: string;
    network?: string;
    org?: string;
}
export declare namespace QueryResultAdminAllocatedExternalAddressRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly IP_ADDRESS: "ipAddress";
        static readonly LINKED_NETWORK: "linkedNetwork";
        static readonly NETWORK: "network";
        static readonly ORG: "org";
    }
}

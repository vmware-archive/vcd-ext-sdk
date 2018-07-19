import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVAppOrgNetworkRelationRecordType extends QueryResultRecordType {
    configurationType?: string;
    name?: string;
    org?: string;
    orgNetwork?: string;
    orgNetworkName?: string;
    ownerName?: string;
    status?: string;
}
export declare namespace QueryResultVAppOrgNetworkRelationRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly CONFIGURATION_TYPE: "configurationType";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly ORG_NETWORK: "orgNetwork";
        static readonly ORG_NETWORK_NAME: "orgNetworkName";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
    }
}

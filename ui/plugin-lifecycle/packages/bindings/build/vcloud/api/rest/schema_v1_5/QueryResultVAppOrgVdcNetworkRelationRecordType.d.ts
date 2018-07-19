import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultVAppOrgVdcNetworkRelationRecordType extends QueryResultRecordType {
    entityType?: string;
    name?: string;
    org?: string;
    orgVdcNetwork?: string;
    orgVdcNetworkName?: string;
    ownerName?: string;
    status?: string;
}
export declare namespace QueryResultVAppOrgVdcNetworkRelationRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly ENTITY_TYPE: "entityType";
        static readonly NAME: "name";
        static readonly ORG: "org";
        static readonly ORG_VDC_NETWORK: "orgVdcNetwork";
        static readonly ORG_VDC_NETWORK_NAME: "orgVdcNetworkName";
        static readonly OWNER_NAME: "ownerName";
        static readonly STATUS: "status";
    }
}

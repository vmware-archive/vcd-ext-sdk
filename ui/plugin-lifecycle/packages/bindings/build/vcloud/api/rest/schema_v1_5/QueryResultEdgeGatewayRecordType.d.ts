import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultEdgeGatewayRecordType extends QueryResultRecordType {
    advancedNetworkingEnabled?: boolean;
    availableNetCount?: number;
    distributedRoutingEnabled?: boolean;
    gatewayStatus?: string;
    haStatus?: string;
    isBusy?: boolean;
    name?: string;
    numberOfExtNetworks?: number;
    numberOfOrgNetworks?: number;
    orgVdcName?: string;
    vdc?: string;
}
export declare namespace QueryResultEdgeGatewayRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly ADVANCED_NETWORKING_ENABLED: "advancedNetworkingEnabled";
        static readonly AVAILABLE_NET_COUNT: "availableNetCount";
        static readonly DISTRIBUTED_ROUTING_ENABLED: "distributedRoutingEnabled";
        static readonly GATEWAY_STATUS: "gatewayStatus";
        static readonly HA_STATUS: "haStatus";
        static readonly IS_BUSY: "isBusy";
        static readonly NAME: "name";
        static readonly NUMBER_OF_EXT_NETWORKS: "numberOfExtNetworks";
        static readonly NUMBER_OF_ORG_NETWORKS: "numberOfOrgNetworks";
        static readonly ORG_VDC_NAME: "orgVdcName";
        static readonly VDC: "vdc";
    }
}

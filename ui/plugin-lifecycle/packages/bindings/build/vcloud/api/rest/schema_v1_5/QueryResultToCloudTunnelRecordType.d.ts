import { QueryResultRecordType } from "./QueryResultRecordType";
export declare class QueryResultToCloudTunnelRecordType extends QueryResultRecordType {
    destinationHost?: string;
    destinationId?: string;
    destinationPort?: number;
    org?: string;
    trafficType?: string;
    useSsl?: boolean;
}
export declare namespace QueryResultToCloudTunnelRecordType {
    class Fields extends QueryResultRecordType.Fields {
        static readonly DESTINATION_HOST: "destinationHost";
        static readonly DESTINATION_ID: "destinationId";
        static readonly DESTINATION_PORT: "destinationPort";
        static readonly ORG: "org";
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly USE_SSL: "useSsl";
    }
}

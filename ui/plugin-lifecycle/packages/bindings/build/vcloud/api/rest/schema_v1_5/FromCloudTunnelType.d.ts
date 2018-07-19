import { EntityType } from "./EntityType";
export declare class FromCloudTunnelType extends EntityType {
    trafficType?: string;
    destinationId?: string;
    endpointTag?: string;
    sourceId?: string;
}
export declare namespace FromCloudTunnelType {
    class Fields extends EntityType.Fields {
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly DESTINATION_ID: "destinationId";
        static readonly ENDPOINT_TAG: "endpointTag";
        static readonly SOURCE_ID: "sourceId";
    }
}

import { EntityType } from "./EntityType";
export declare class ToCloudTunnelType extends EntityType {
    trafficType?: string;
    destinationId?: string;
    sourceId?: string;
}
export declare namespace ToCloudTunnelType {
    class Fields extends EntityType.Fields {
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly DESTINATION_ID: "destinationId";
        static readonly SOURCE_ID: "sourceId";
    }
}

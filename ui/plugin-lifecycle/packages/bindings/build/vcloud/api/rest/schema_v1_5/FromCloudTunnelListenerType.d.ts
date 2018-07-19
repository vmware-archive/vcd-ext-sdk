import { EntityType } from "./EntityType";
export declare class FromCloudTunnelListenerType extends EntityType {
    port?: number;
    trafficType?: string;
    endpointTag?: string;
}
export declare namespace FromCloudTunnelListenerType {
    class Fields extends EntityType.Fields {
        static readonly PORT: "port";
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly ENDPOINT_TAG: "endpointTag";
    }
}

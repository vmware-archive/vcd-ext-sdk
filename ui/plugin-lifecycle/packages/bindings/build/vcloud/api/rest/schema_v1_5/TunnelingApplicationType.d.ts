import { EntityType } from "./EntityType";
export declare class TunnelingApplicationType extends EntityType {
    trafficType?: string;
    routingKey?: string;
    exchange?: string;
}
export declare namespace TunnelingApplicationType {
    class Fields extends EntityType.Fields {
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly ROUTING_KEY: "routingKey";
        static readonly EXCHANGE: "exchange";
    }
}

import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class TunnelingApplicationRegisterParamsType extends VCloudExtensibleType {
    trafficType?: string;
    routingKey?: string;
    exchange?: string;
}
export declare namespace TunnelingApplicationRegisterParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly ROUTING_KEY: "routingKey";
        static readonly EXCHANGE: "exchange";
    }
}

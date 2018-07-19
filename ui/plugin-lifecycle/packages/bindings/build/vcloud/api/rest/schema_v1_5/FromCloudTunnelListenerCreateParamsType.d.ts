import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class FromCloudTunnelListenerCreateParamsType extends VCloudExtensibleType {
    port?: number;
    trafficType?: string;
    endpointTag?: string;
}
export declare namespace FromCloudTunnelListenerCreateParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly PORT: "port";
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly ENDPOINT_TAG: "endpointTag";
    }
}

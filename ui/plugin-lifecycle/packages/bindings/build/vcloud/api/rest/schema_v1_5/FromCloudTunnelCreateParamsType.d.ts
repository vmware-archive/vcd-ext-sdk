import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class FromCloudTunnelCreateParamsType extends VCloudExtensibleType {
    trafficType?: string;
    destinationId?: string;
    endpointTag?: string;
    sourceId?: string;
}
export declare namespace FromCloudTunnelCreateParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly DESTINATION_ID: "destinationId";
        static readonly ENDPOINT_TAG: "endpointTag";
        static readonly SOURCE_ID: "sourceId";
    }
}

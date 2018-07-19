import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ToCloudTunnelCreateParamsType extends VCloudExtensibleType {
    trafficType?: string;
    destinationId?: string;
    sourceId?: string;
}
export declare namespace ToCloudTunnelCreateParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly TRAFFIC_TYPE: "trafficType";
        static readonly DESTINATION_ID: "destinationId";
        static readonly SOURCE_ID: "sourceId";
    }
}

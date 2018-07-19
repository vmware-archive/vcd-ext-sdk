import { NetworkServiceInsertionType } from "./NetworkServiceInsertionType";
export declare class VendorServicesType {
    networkServices?: NetworkServiceInsertionType[];
    edgeGatewayServices?: NetworkServiceInsertionType[];
}
export declare namespace VendorServicesType {
    class Fields {
        static readonly NETWORK_SERVICES: "networkServices";
        static readonly EDGE_GATEWAY_SERVICES: "edgeGatewayServices";
    }
}

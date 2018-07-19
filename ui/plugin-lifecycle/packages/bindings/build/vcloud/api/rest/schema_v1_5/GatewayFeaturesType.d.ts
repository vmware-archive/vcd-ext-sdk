import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { NetworkServiceType } from "./NetworkServiceType";
export declare class GatewayFeaturesType extends VCloudExtensibleType {
    networkService?: NetworkServiceType[];
}
export declare namespace GatewayFeaturesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NETWORK_SERVICE: "networkService";
    }
}

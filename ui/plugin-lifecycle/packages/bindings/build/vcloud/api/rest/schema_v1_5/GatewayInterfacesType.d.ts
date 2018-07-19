import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { GatewayInterfaceType } from "./GatewayInterfaceType";
export declare class GatewayInterfacesType extends VCloudExtensibleType {
    gatewayInterface?: GatewayInterfaceType[];
}
export declare namespace GatewayInterfacesType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly GATEWAY_INTERFACE: "gatewayInterface";
    }
}

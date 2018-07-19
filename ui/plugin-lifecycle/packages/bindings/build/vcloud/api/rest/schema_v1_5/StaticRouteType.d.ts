import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class StaticRouteType extends VCloudExtensibleType {
    name?: string;
    network?: string;
    nextHopIp?: string;
    _interface?: string;
    gatewayInterface?: ReferenceType;
}
export declare namespace StaticRouteType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NAME: "name";
        static readonly NETWORK: "network";
        static readonly NEXT_HOP_IP: "nextHopIp";
        static readonly _INTERFACE: "_interface";
        static readonly GATEWAY_INTERFACE: "gatewayInterface";
    }
}

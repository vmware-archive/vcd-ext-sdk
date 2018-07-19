import { GatewayBackingRefType } from "./GatewayBackingRefType";
import { GatewayConfigurationType } from "./GatewayConfigurationType";
import { EntityType } from "./EntityType";
export declare class GatewayType extends EntityType {
    gatewayBackingRef?: GatewayBackingRefType;
    configuration?: GatewayConfigurationType;
    status?: number;
}
export declare namespace GatewayType {
    class Fields extends EntityType.Fields {
        static readonly GATEWAY_BACKING_REF: "gatewayBackingRef";
        static readonly CONFIGURATION: "configuration";
        static readonly STATUS: "status";
    }
}

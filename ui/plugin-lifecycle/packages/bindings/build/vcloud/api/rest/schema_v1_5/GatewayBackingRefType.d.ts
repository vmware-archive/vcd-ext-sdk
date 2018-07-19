import { EntityReferenceType } from "./EntityReferenceType";
export declare class GatewayBackingRefType {
    gatewayId?: string;
    vcRef?: EntityReferenceType;
}
export declare namespace GatewayBackingRefType {
    class Fields {
        static readonly GATEWAY_ID: "gatewayId";
        static readonly VC_REF: "vcRef";
    }
}

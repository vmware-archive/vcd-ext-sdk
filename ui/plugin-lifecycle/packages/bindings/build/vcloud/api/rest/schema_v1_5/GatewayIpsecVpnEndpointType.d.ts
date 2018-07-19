import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class GatewayIpsecVpnEndpointType extends VCloudExtensibleType {
    network?: ReferenceType;
    publicIp?: string;
}
export declare namespace GatewayIpsecVpnEndpointType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NETWORK: "network";
        static readonly PUBLIC_IP: "publicIp";
    }
}

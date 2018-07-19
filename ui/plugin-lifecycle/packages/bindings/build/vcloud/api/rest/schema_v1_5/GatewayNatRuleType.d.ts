import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ReferenceType } from "./ReferenceType";
export declare class GatewayNatRuleType extends VCloudExtensibleType {
    _interface?: ReferenceType;
    originalIp?: string;
    originalPort?: string;
    translatedIp?: string;
    translatedPort?: string;
    protocol?: string;
    icmpSubType?: string;
}
export declare namespace GatewayNatRuleType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly _INTERFACE: "_interface";
        static readonly ORIGINAL_IP: "originalIp";
        static readonly ORIGINAL_PORT: "originalPort";
        static readonly TRANSLATED_IP: "translatedIp";
        static readonly TRANSLATED_PORT: "translatedPort";
        static readonly PROTOCOL: "protocol";
        static readonly ICMP_SUB_TYPE: "icmpSubType";
    }
}

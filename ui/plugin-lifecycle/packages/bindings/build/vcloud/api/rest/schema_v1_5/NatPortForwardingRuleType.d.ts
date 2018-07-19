import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class NatPortForwardingRuleType extends VCloudExtensibleType {
    externalIpAddress?: string;
    externalPort?: number;
    internalIpAddress?: string;
    internalPort?: number;
    protocol?: string;
}
export declare namespace NatPortForwardingRuleType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly EXTERNAL_IP_ADDRESS: "externalIpAddress";
        static readonly EXTERNAL_PORT: "externalPort";
        static readonly INTERNAL_IP_ADDRESS: "internalIpAddress";
        static readonly INTERNAL_PORT: "internalPort";
        static readonly PROTOCOL: "protocol";
    }
}

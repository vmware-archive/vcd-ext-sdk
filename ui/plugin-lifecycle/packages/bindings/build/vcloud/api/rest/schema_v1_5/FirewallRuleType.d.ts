import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { FirewallRuleProtocols } from "./FirewallRuleProtocols";
import { VmSelectionType } from "./VmSelectionType";
export declare class FirewallRuleType extends VCloudExtensibleType {
    id?: string;
    isEnabled?: boolean;
    matchOnTranslate?: boolean;
    description?: string;
    policy?: string;
    protocols?: FirewallRuleProtocols;
    icmpSubType?: string;
    port?: number;
    destinationPortRange?: string;
    destinationIp?: string;
    destinationVm?: VmSelectionType;
    sourcePort?: number;
    sourcePortRange?: string;
    sourceIp?: string;
    sourceVm?: VmSelectionType;
    direction?: string;
    enableLogging?: boolean;
}
export declare namespace FirewallRuleType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly ID: "id";
        static readonly IS_ENABLED: "isEnabled";
        static readonly MATCH_ON_TRANSLATE: "matchOnTranslate";
        static readonly DESCRIPTION: "description";
        static readonly POLICY: "policy";
        static readonly PROTOCOLS: "protocols";
        static readonly ICMP_SUB_TYPE: "icmpSubType";
        static readonly PORT: "port";
        static readonly DESTINATION_PORT_RANGE: "destinationPortRange";
        static readonly DESTINATION_IP: "destinationIp";
        static readonly DESTINATION_VM: "destinationVm";
        static readonly SOURCE_PORT: "sourcePort";
        static readonly SOURCE_PORT_RANGE: "sourcePortRange";
        static readonly SOURCE_IP: "sourceIp";
        static readonly SOURCE_VM: "sourceVm";
        static readonly DIRECTION: "direction";
        static readonly ENABLE_LOGGING: "enableLogging";
    }
}

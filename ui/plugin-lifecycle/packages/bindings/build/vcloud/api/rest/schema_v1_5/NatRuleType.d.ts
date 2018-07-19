import { NatOneToOneVmRuleType } from "./NatOneToOneVmRuleType";
import { NatPortForwardingRuleType } from "./NatPortForwardingRuleType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { NatVmRuleType } from "./NatVmRuleType";
import { NatOneToOneBasicRuleType } from "./NatOneToOneBasicRuleType";
import { GatewayNatRuleType } from "./GatewayNatRuleType";
export declare class NatRuleType extends VCloudExtensibleType {
    description?: string;
    ruleType?: string;
    isEnabled?: boolean;
    id?: number;
    gatewayNatRule?: GatewayNatRuleType;
    oneToOneBasicRule?: NatOneToOneBasicRuleType;
    oneToOneVmRule?: NatOneToOneVmRuleType;
    portForwardingRule?: NatPortForwardingRuleType;
    vmRule?: NatVmRuleType;
}
export declare namespace NatRuleType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DESCRIPTION: "description";
        static readonly RULE_TYPE: "ruleType";
        static readonly IS_ENABLED: "isEnabled";
        static readonly ID: "id";
        static readonly GATEWAY_NAT_RULE: "gatewayNatRule";
        static readonly ONE_TO_ONE_BASIC_RULE: "oneToOneBasicRule";
        static readonly ONE_TO_ONE_VM_RULE: "oneToOneVmRule";
        static readonly PORT_FORWARDING_RULE: "portForwardingRule";
        static readonly VM_RULE: "vmRule";
    }
}

import { FirewallRuleType } from "./FirewallRuleType";
import { NetworkServiceType } from "./NetworkServiceType";
export declare class FirewallServiceType extends NetworkServiceType {
    defaultAction?: string;
    logDefaultAction?: boolean;
    firewallRule?: FirewallRuleType[];
}
export declare namespace FirewallServiceType {
    class Fields extends NetworkServiceType.Fields {
        static readonly DEFAULT_ACTION: "defaultAction";
        static readonly LOG_DEFAULT_ACTION: "logDefaultAction";
        static readonly FIREWALL_RULE: "firewallRule";
    }
}

import { NatRuleType } from "./NatRuleType";
import { NetworkServiceType } from "./NetworkServiceType";
export declare class NatServiceType extends NetworkServiceType {
    natType?: string;
    policy?: string;
    natRule?: NatRuleType[];
    externalIp?: string;
}
export declare namespace NatServiceType {
    class Fields extends NetworkServiceType.Fields {
        static readonly NAT_TYPE: "natType";
        static readonly POLICY: "policy";
        static readonly NAT_RULE: "natRule";
        static readonly EXTERNAL_IP: "externalIp";
    }
}

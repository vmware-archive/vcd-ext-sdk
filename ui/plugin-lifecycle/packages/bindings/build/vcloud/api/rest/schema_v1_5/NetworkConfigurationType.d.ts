import { SyslogServerSettingsType } from "./SyslogServerSettingsType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { IpScopesType } from "./IpScopesType";
import { NetworkFeaturesType } from "./NetworkFeaturesType";
import { IpScopeType } from "./IpScopeType";
import { RouterInfoType } from "./RouterInfoType";
import { ReferenceType } from "./ReferenceType";
export declare class NetworkConfigurationType extends VCloudExtensibleType {
    backwardCompatibilityMode?: boolean;
    ipScope?: IpScopeType;
    ipScopes?: IpScopesType;
    parentNetwork?: ReferenceType;
    fenceMode?: string;
    retainNetInfoAcrossDeployments?: boolean;
    features?: NetworkFeaturesType;
    syslogServerSettings?: SyslogServerSettingsType;
    routerInfo?: RouterInfoType;
    advancedNetworkingEnabled?: boolean;
    subInterface?: boolean;
    distributedInterface?: boolean;
    guestVlanAllowed?: boolean;
}
export declare namespace NetworkConfigurationType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly BACKWARD_COMPATIBILITY_MODE: "backwardCompatibilityMode";
        static readonly IP_SCOPE: "ipScope";
        static readonly IP_SCOPES: "ipScopes";
        static readonly PARENT_NETWORK: "parentNetwork";
        static readonly FENCE_MODE: "fenceMode";
        static readonly RETAIN_NET_INFO_ACROSS_DEPLOYMENTS: "retainNetInfoAcrossDeployments";
        static readonly FEATURES: "features";
        static readonly SYSLOG_SERVER_SETTINGS: "syslogServerSettings";
        static readonly ROUTER_INFO: "routerInfo";
        static readonly ADVANCED_NETWORKING_ENABLED: "advancedNetworkingEnabled";
        static readonly SUB_INTERFACE: "subInterface";
        static readonly DISTRIBUTED_INTERFACE: "distributedInterface";
        static readonly GUEST_VLAN_ALLOWED: "guestVlanAllowed";
    }
}

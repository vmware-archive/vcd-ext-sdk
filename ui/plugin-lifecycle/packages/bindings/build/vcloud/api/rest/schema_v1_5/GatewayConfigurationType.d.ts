import { SyslogServerType } from "./SyslogServerType";
import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { GatewayFeaturesType } from "./GatewayFeaturesType";
import { GatewayInterfacesType } from "./GatewayInterfacesType";
export declare class GatewayConfigurationType extends VCloudExtensibleType {
    backwardCompatibilityMode?: boolean;
    gatewayBackingConfig?: string;
    gatewayInterfaces?: GatewayInterfacesType;
    edgeGatewayServiceConfiguration?: GatewayFeaturesType;
    haEnabled?: boolean;
    useDefaultRouteForDnsRelay?: boolean;
    syslogServerSettings?: SyslogServerType;
    advancedNetworkingEnabled?: boolean;
    distributedRoutingEnabled?: boolean;
    fipsModeEnabled?: boolean;
}
export declare namespace GatewayConfigurationType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly BACKWARD_COMPATIBILITY_MODE: "backwardCompatibilityMode";
        static readonly GATEWAY_BACKING_CONFIG: "gatewayBackingConfig";
        static readonly GATEWAY_INTERFACES: "gatewayInterfaces";
        static readonly EDGE_GATEWAY_SERVICE_CONFIGURATION: "edgeGatewayServiceConfiguration";
        static readonly HA_ENABLED: "haEnabled";
        static readonly USE_DEFAULT_ROUTE_FOR_DNS_RELAY: "useDefaultRouteForDnsRelay";
        static readonly SYSLOG_SERVER_SETTINGS: "syslogServerSettings";
        static readonly ADVANCED_NETWORKING_ENABLED: "advancedNetworkingEnabled";
        static readonly DISTRIBUTED_ROUTING_ENABLED: "distributedRoutingEnabled";
        static readonly FIPS_MODE_ENABLED: "fipsModeEnabled";
    }
}

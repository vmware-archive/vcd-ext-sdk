import { ResourceType } from "./ResourceType";
import { NetworkConfigurationType } from "./NetworkConfigurationType";
export declare class VAppNetworkConfigurationType extends ResourceType {
    description?: string;
    configuration?: NetworkConfigurationType;
    isDeployed?: boolean;
    networkName?: string;
}
export declare namespace VAppNetworkConfigurationType {
    class Fields extends ResourceType.Fields {
        static readonly DESCRIPTION: "description";
        static readonly CONFIGURATION: "configuration";
        static readonly IS_DEPLOYED: "isDeployed";
        static readonly NETWORK_NAME: "networkName";
    }
}

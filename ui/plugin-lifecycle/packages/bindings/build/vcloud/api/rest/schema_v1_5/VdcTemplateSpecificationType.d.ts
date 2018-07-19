import { VdcStorageProfileType } from "./VdcStorageProfileType";
import { VdcTemplateSpecificationGatewayConfigurationType } from "./VdcTemplateSpecificationGatewayConfigurationType";
export declare abstract class VdcTemplateSpecificationType {
    nicQuota?: number;
    vmQuota?: number;
    provisionedNetworkQuota?: number;
    gatewayConfiguration?: VdcTemplateSpecificationGatewayConfigurationType;
    storageProfile?: VdcStorageProfileType[];
}
export declare namespace VdcTemplateSpecificationType {
    class Fields {
        static readonly NIC_QUOTA: "nicQuota";
        static readonly VM_QUOTA: "vmQuota";
        static readonly PROVISIONED_NETWORK_QUOTA: "provisionedNetworkQuota";
        static readonly GATEWAY_CONFIGURATION: "gatewayConfiguration";
        static readonly STORAGE_PROFILE: "storageProfile";
    }
}

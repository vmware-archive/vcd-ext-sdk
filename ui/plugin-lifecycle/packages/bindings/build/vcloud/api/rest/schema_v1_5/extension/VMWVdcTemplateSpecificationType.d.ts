import { AutomaticNetworkPoolReferenceType } from "./AutomaticNetworkPoolReferenceType";
import { VdcStorageProfileType } from "./../VdcStorageProfileType";
import { VdcTemplateSpecificationGatewayConfigurationType } from "./../VdcTemplateSpecificationGatewayConfigurationType";
import { ReferenceType } from "./../ReferenceType";
export declare abstract class VMWVdcTemplateSpecificationType {
    nicQuota?: number;
    vmQuota?: number;
    provisionedNetworkQuota?: number;
    gatewayConfiguration?: VdcTemplateSpecificationGatewayConfigurationType;
    storageProfile?: VdcStorageProfileType[];
    thinProvision?: boolean;
    fastProvisioningEnabled?: boolean;
    networkPoolReference?: ReferenceType;
    automaticNetworkPoolReference?: AutomaticNetworkPoolReferenceType;
}
export declare namespace VMWVdcTemplateSpecificationType {
    class Fields {
        static readonly NIC_QUOTA: "nicQuota";
        static readonly VM_QUOTA: "vmQuota";
        static readonly PROVISIONED_NETWORK_QUOTA: "provisionedNetworkQuota";
        static readonly GATEWAY_CONFIGURATION: "gatewayConfiguration";
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly THIN_PROVISION: "thinProvision";
        static readonly FAST_PROVISIONING_ENABLED: "fastProvisioningEnabled";
        static readonly NETWORK_POOL_REFERENCE: "networkPoolReference";
        static readonly AUTOMATIC_NETWORK_POOL_REFERENCE: "automaticNetworkPoolReference";
    }
}

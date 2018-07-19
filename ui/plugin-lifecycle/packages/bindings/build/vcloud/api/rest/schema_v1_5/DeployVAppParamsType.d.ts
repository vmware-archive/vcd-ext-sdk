import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class DeployVAppParamsType extends VCloudExtensibleType {
    deploymentLeaseSeconds?: number;
    forceCustomization?: boolean;
    powerOn?: boolean;
}
export declare namespace DeployVAppParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly DEPLOYMENT_LEASE_SECONDS: "deploymentLeaseSeconds";
        static readonly FORCE_CUSTOMIZATION: "forceCustomization";
        static readonly POWER_ON: "powerOn";
    }
}

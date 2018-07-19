import { ResourceType } from "./ResourceType";
export declare class OrgLeaseSettingsType extends ResourceType {
    deleteOnStorageLeaseExpiration?: boolean;
    deploymentLeaseSeconds?: number;
    storageLeaseSeconds?: number;
    powerOffOnRuntimeLeaseExpiration?: boolean;
}
export declare namespace OrgLeaseSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly DELETE_ON_STORAGE_LEASE_EXPIRATION: "deleteOnStorageLeaseExpiration";
        static readonly DEPLOYMENT_LEASE_SECONDS: "deploymentLeaseSeconds";
        static readonly STORAGE_LEASE_SECONDS: "storageLeaseSeconds";
        static readonly POWER_OFF_ON_RUNTIME_LEASE_EXPIRATION: "powerOffOnRuntimeLeaseExpiration";
    }
}

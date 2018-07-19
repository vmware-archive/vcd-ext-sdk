import { ResourceType } from "./ResourceType";
export declare class OrgVAppTemplateLeaseSettingsType extends ResourceType {
    deleteOnStorageLeaseExpiration?: boolean;
    storageLeaseSeconds?: number;
}
export declare namespace OrgVAppTemplateLeaseSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly DELETE_ON_STORAGE_LEASE_EXPIRATION: "deleteOnStorageLeaseExpiration";
        static readonly STORAGE_LEASE_SECONDS: "storageLeaseSeconds";
    }
}

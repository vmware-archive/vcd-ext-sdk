import { ResourceType } from "./ResourceType";
export declare class OrgGeneralSettingsType extends ResourceType {
    canPublishCatalogs?: boolean;
    canPublishExternally?: boolean;
    canSubscribe?: boolean;
    deployedVMQuota?: number;
    storedVmQuota?: number;
    useServerBootSequence?: boolean;
    delayAfterPowerOnSeconds?: number;
    vdcQuota?: number;
    vmDiscoveryEnabled?: boolean;
}
export declare namespace OrgGeneralSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly CAN_PUBLISH_CATALOGS: "canPublishCatalogs";
        static readonly CAN_PUBLISH_EXTERNALLY: "canPublishExternally";
        static readonly CAN_SUBSCRIBE: "canSubscribe";
        static readonly DEPLOYED_VM_QUOTA: "deployedVMQuota";
        static readonly STORED_VM_QUOTA: "storedVmQuota";
        static readonly USE_SERVER_BOOT_SEQUENCE: "useServerBootSequence";
        static readonly DELAY_AFTER_POWER_ON_SECONDS: "delayAfterPowerOnSeconds";
        static readonly VDC_QUOTA: "vdcQuota";
        static readonly VM_DISCOVERY_ENABLED: "vmDiscoveryEnabled";
    }
}

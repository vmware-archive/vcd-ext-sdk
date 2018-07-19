import { EnvironmentType } from "./../schema/ovf/environment/EnvironmentType";
import { BootOptionsType } from "./BootOptionsType";
import { AbstractVAppType } from "./AbstractVAppType";
import { VmCapabilitiesType } from "./VmCapabilitiesType";
import { ReferenceType } from "./ReferenceType";
export declare class VmType extends AbstractVAppType {
    vAppScopedLocalId?: string;
    environment?: EnvironmentType;
    vmCapabilities?: VmCapabilitiesType;
    storageProfile?: ReferenceType;
    bootOptions?: BootOptionsType;
    media?: ReferenceType;
    needsCustomization?: boolean;
    nestedHypervisorEnabled?: boolean;
}
export declare namespace VmType {
    class Fields extends AbstractVAppType.Fields {
        static readonly V_APP_SCOPED_LOCAL_ID: "vAppScopedLocalId";
        static readonly ENVIRONMENT: "environment";
        static readonly VM_CAPABILITIES: "vmCapabilities";
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly BOOT_OPTIONS: "bootOptions";
        static readonly MEDIA: "media";
        static readonly NEEDS_CUSTOMIZATION: "needsCustomization";
        static readonly NESTED_HYPERVISOR_ENABLED: "nestedHypervisorEnabled";
    }
}

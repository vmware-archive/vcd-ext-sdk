import { ParamsType } from "./../ParamsType";
import { VimObjectRefsType } from "./VimObjectRefsType";
import { HostObjectRefsType } from "./HostObjectRefsType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWProviderVdcParamsType extends ParamsType {
    resourcePoolRefs?: VimObjectRefsType;
    vimServer?: ReferenceType[];
    vxlanNetworkPool?: ReferenceType;
    highestSupportedHardwareVersion?: string;
    isEnabled?: boolean;
    storageProfile?: string[];
    hostRefs?: HostObjectRefsType;
    defaultPassword?: string;
    defaultUsername?: string;
}
export declare namespace VMWProviderVdcParamsType {
    class Fields extends ParamsType.Fields {
        static readonly RESOURCE_POOL_REFS: "resourcePoolRefs";
        static readonly VIM_SERVER: "vimServer";
        static readonly VXLAN_NETWORK_POOL: "vxlanNetworkPool";
        static readonly HIGHEST_SUPPORTED_HARDWARE_VERSION: "highestSupportedHardwareVersion";
        static readonly IS_ENABLED: "isEnabled";
        static readonly STORAGE_PROFILE: "storageProfile";
        static readonly HOST_REFS: "hostRefs";
        static readonly DEFAULT_PASSWORD: "defaultPassword";
        static readonly DEFAULT_USERNAME: "defaultUsername";
    }
}

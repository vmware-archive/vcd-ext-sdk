import { VMWHostReferencesType } from "./VMWHostReferencesType";
import { VimObjectRefsType } from "./VimObjectRefsType";
import { ProviderVdcType } from "./../ProviderVdcType";
import { ReferenceType } from "./../ReferenceType";
export declare class VMWProviderVdcType extends ProviderVdcType {
    dataStoreRefs?: VimObjectRefsType;
    resourcePoolRefs?: VimObjectRefsType;
    vimServer?: ReferenceType[];
    hostReferences?: VMWHostReferencesType;
    highestSupportedHardwareVersion?: string;
}
export declare namespace VMWProviderVdcType {
    class Fields extends ProviderVdcType.Fields {
        static readonly DATA_STORE_REFS: "dataStoreRefs";
        static readonly RESOURCE_POOL_REFS: "resourcePoolRefs";
        static readonly VIM_SERVER: "vimServer";
        static readonly HOST_REFERENCES: "hostReferences";
        static readonly HIGHEST_SUPPORTED_HARDWARE_VERSION: "highestSupportedHardwareVersion";
    }
}

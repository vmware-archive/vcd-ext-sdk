import { VendorServicesType } from "./VendorServicesType";
import { VimObjectRefsType } from "./extension/VimObjectRefsType";
import { VdcType } from "./VdcType";
import { ReferenceType } from "./ReferenceType";
export declare class AdminVdcType extends VdcType {
    resourceGuaranteedMemory?: number;
    resourceGuaranteedCpu?: number;
    vCpuInMhz?: number;
    isThinProvision?: boolean;
    networkPoolReference?: ReferenceType;
    vendorServices?: VendorServicesType;
    providerVdcReference?: ReferenceType;
    resourcePoolRefs?: VimObjectRefsType;
    usesFastProvisioning?: boolean;
    overCommitAllowed?: boolean;
    vmDiscoveryEnabled?: boolean;
    universalNetworkPoolReference?: ReferenceType;
}
export declare namespace AdminVdcType {
    class Fields extends VdcType.Fields {
        static readonly RESOURCE_GUARANTEED_MEMORY: "resourceGuaranteedMemory";
        static readonly RESOURCE_GUARANTEED_CPU: "resourceGuaranteedCpu";
        static readonly V_CPU_IN_MHZ: "vCpuInMhz";
        static readonly IS_THIN_PROVISION: "isThinProvision";
        static readonly NETWORK_POOL_REFERENCE: "networkPoolReference";
        static readonly VENDOR_SERVICES: "vendorServices";
        static readonly PROVIDER_VDC_REFERENCE: "providerVdcReference";
        static readonly RESOURCE_POOL_REFS: "resourcePoolRefs";
        static readonly USES_FAST_PROVISIONING: "usesFastProvisioning";
        static readonly OVER_COMMIT_ALLOWED: "overCommitAllowed";
        static readonly VM_DISCOVERY_ENABLED: "vmDiscoveryEnabled";
        static readonly UNIVERSAL_NETWORK_POOL_REFERENCE: "universalNetworkPoolReference";
    }
}

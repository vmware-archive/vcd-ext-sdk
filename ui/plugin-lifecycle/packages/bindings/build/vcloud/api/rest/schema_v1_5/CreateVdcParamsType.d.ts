import { VdcStorageProfileParamsType } from "./VdcStorageProfileParamsType";
import { VimObjectRefsType } from "./extension/VimObjectRefsType";
import { ComputeCapacityType } from "./ComputeCapacityType";
import { ParamsType } from "./ParamsType";
import { ReferenceType } from "./ReferenceType";
export declare class CreateVdcParamsType extends ParamsType {
    allocationModel?: string;
    computeCapacity?: ComputeCapacityType;
    nicQuota?: number;
    networkQuota?: number;
    vmQuota?: number;
    isEnabled?: boolean;
    vdcStorageProfile?: VdcStorageProfileParamsType[];
    resourceGuaranteedMemory?: number;
    resourceGuaranteedCpu?: number;
    vCpuInMhz?: number;
    isThinProvision?: boolean;
    networkPoolReference?: ReferenceType;
    providerVdcReference?: ReferenceType;
    resourcePoolRefs?: VimObjectRefsType;
    usesFastProvisioning?: boolean;
    overCommitAllowed?: boolean;
    vmDiscoveryEnabled?: boolean;
}
export declare namespace CreateVdcParamsType {
    class Fields extends ParamsType.Fields {
        static readonly ALLOCATION_MODEL: "allocationModel";
        static readonly COMPUTE_CAPACITY: "computeCapacity";
        static readonly NIC_QUOTA: "nicQuota";
        static readonly NETWORK_QUOTA: "networkQuota";
        static readonly VM_QUOTA: "vmQuota";
        static readonly IS_ENABLED: "isEnabled";
        static readonly VDC_STORAGE_PROFILE: "vdcStorageProfile";
        static readonly RESOURCE_GUARANTEED_MEMORY: "resourceGuaranteedMemory";
        static readonly RESOURCE_GUARANTEED_CPU: "resourceGuaranteedCpu";
        static readonly V_CPU_IN_MHZ: "vCpuInMhz";
        static readonly IS_THIN_PROVISION: "isThinProvision";
        static readonly NETWORK_POOL_REFERENCE: "networkPoolReference";
        static readonly PROVIDER_VDC_REFERENCE: "providerVdcReference";
        static readonly RESOURCE_POOL_REFS: "resourcePoolRefs";
        static readonly USES_FAST_PROVISIONING: "usesFastProvisioning";
        static readonly OVER_COMMIT_ALLOWED: "overCommitAllowed";
        static readonly VM_DISCOVERY_ENABLED: "vmDiscoveryEnabled";
    }
}

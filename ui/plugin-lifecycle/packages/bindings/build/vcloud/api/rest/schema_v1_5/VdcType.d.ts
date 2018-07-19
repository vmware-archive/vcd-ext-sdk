import { ResourceEntitiesType } from "./ResourceEntitiesType";
import { CapabilitiesType } from "./CapabilitiesType";
import { VdcStorageProfilesType } from "./VdcStorageProfilesType";
import { EntityType } from "./EntityType";
import { ComputeCapacityType } from "./ComputeCapacityType";
import { CapacityWithUsageType } from "./CapacityWithUsageType";
import { AvailableNetworksType } from "./AvailableNetworksType";
export declare class VdcType extends EntityType {
    allocationModel?: string;
    storageCapacity?: CapacityWithUsageType;
    computeCapacity?: ComputeCapacityType;
    resourceEntities?: ResourceEntitiesType;
    availableNetworks?: AvailableNetworksType;
    capabilities?: CapabilitiesType;
    nicQuota?: number;
    networkQuota?: number;
    usedNetworkCount?: number;
    vmQuota?: number;
    isEnabled?: boolean;
    vdcStorageProfiles?: VdcStorageProfilesType;
    vCpuInMhz2?: number;
    status?: number;
}
export declare namespace VdcType {
    class Fields extends EntityType.Fields {
        static readonly ALLOCATION_MODEL: "allocationModel";
        static readonly STORAGE_CAPACITY: "storageCapacity";
        static readonly COMPUTE_CAPACITY: "computeCapacity";
        static readonly RESOURCE_ENTITIES: "resourceEntities";
        static readonly AVAILABLE_NETWORKS: "availableNetworks";
        static readonly CAPABILITIES: "capabilities";
        static readonly NIC_QUOTA: "nicQuota";
        static readonly NETWORK_QUOTA: "networkQuota";
        static readonly USED_NETWORK_COUNT: "usedNetworkCount";
        static readonly VM_QUOTA: "vmQuota";
        static readonly IS_ENABLED: "isEnabled";
        static readonly VDC_STORAGE_PROFILES: "vdcStorageProfiles";
        static readonly V_CPU_IN_MHZ2: "vCpuInMhz2";
        static readonly STATUS: "status";
    }
}

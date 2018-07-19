import { RootComputeCapacityType } from "./RootComputeCapacityType";
import { ProviderVdcStorageProfilesType } from "./ProviderVdcStorageProfilesType";
import { CapabilitiesType } from "./CapabilitiesType";
import { VdcsType } from "./VdcsType";
import { ProviderVdcCapacityType } from "./ProviderVdcCapacityType";
import { EntityType } from "./EntityType";
import { AvailableNetworksType } from "./AvailableNetworksType";
import { NetworkPoolReferencesType } from "./NetworkPoolReferencesType";
export declare class ProviderVdcType extends EntityType {
    computeCapacity?: RootComputeCapacityType;
    storageCapacity?: ProviderVdcCapacityType;
    availableNetworks?: AvailableNetworksType;
    storageProfiles?: ProviderVdcStorageProfilesType;
    capabilities?: CapabilitiesType;
    vdcs?: VdcsType;
    isEnabled?: boolean;
    networkPoolReferences?: NetworkPoolReferencesType;
    status?: number;
}
export declare namespace ProviderVdcType {
    class Fields extends EntityType.Fields {
        static readonly COMPUTE_CAPACITY: "computeCapacity";
        static readonly STORAGE_CAPACITY: "storageCapacity";
        static readonly AVAILABLE_NETWORKS: "availableNetworks";
        static readonly STORAGE_PROFILES: "storageProfiles";
        static readonly CAPABILITIES: "capabilities";
        static readonly VDCS: "vdcs";
        static readonly IS_ENABLED: "isEnabled";
        static readonly NETWORK_POOL_REFERENCES: "networkPoolReferences";
        static readonly STATUS: "status";
    }
}

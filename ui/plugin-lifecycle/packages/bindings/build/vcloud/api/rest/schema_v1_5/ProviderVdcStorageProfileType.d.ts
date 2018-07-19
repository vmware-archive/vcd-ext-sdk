import { EntityType } from "./EntityType";
export declare class ProviderVdcStorageProfileType extends EntityType {
    enabled?: boolean;
    units?: string;
    capacityTotal?: number;
    capacityUsed?: number;
    iopsCapacity?: number;
    iopsAllocated?: number;
}
export declare namespace ProviderVdcStorageProfileType {
    class Fields extends EntityType.Fields {
        static readonly ENABLED: "enabled";
        static readonly UNITS: "units";
        static readonly CAPACITY_TOTAL: "capacityTotal";
        static readonly CAPACITY_USED: "capacityUsed";
        static readonly IOPS_CAPACITY: "iopsCapacity";
        static readonly IOPS_ALLOCATED: "iopsAllocated";
    }
}

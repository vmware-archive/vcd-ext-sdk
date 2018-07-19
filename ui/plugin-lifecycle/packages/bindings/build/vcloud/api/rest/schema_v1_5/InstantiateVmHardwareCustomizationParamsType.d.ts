import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { Disk } from "./Disk";
export declare class InstantiateVmHardwareCustomizationParamsType extends VCloudExtensibleType {
    numberOfCpus?: number;
    coresPerSocket?: number;
    memorySize?: number;
    disk?: Disk[];
}
export declare namespace InstantiateVmHardwareCustomizationParamsType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly NUMBER_OF_CPUS: "numberOfCpus";
        static readonly CORES_PER_SOCKET: "coresPerSocket";
        static readonly MEMORY_SIZE: "memorySize";
        static readonly DISK: "disk";
    }
}

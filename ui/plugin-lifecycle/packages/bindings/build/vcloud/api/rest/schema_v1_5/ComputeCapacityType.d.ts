import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { CapacityWithUsageType } from "./CapacityWithUsageType";
export declare class ComputeCapacityType extends VCloudExtensibleType {
    cpu?: CapacityWithUsageType;
    memory?: CapacityWithUsageType;
}
export declare namespace ComputeCapacityType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly CPU: "cpu";
        static readonly MEMORY: "memory";
    }
}

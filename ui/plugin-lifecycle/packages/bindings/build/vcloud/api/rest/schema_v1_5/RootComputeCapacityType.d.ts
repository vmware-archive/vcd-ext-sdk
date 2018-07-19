import { VCloudExtensibleType } from "./VCloudExtensibleType";
import { ProviderVdcCapacityType } from "./ProviderVdcCapacityType";
export declare class RootComputeCapacityType extends VCloudExtensibleType {
    cpu?: ProviderVdcCapacityType;
    memory?: ProviderVdcCapacityType;
    isElastic?: boolean;
    isHA?: boolean;
}
export declare namespace RootComputeCapacityType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly CPU: "cpu";
        static readonly MEMORY: "memory";
        static readonly IS_ELASTIC: "isElastic";
        static readonly IS_HA: "isHA";
    }
}

import { ResourceType } from "./ResourceType";
export declare class VmCapabilitiesType extends ResourceType {
    memoryHotAddEnabled?: boolean;
    cpuHotAddEnabled?: boolean;
}
export declare namespace VmCapabilitiesType {
    class Fields extends ResourceType.Fields {
        static readonly MEMORY_HOT_ADD_ENABLED: "memoryHotAddEnabled";
        static readonly CPU_HOT_ADD_ENABLED: "cpuHotAddEnabled";
    }
}

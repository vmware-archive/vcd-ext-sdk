import { VdcTemplateSpecificationType } from "./VdcTemplateSpecificationType";
export declare class AllocationPoolVdcTemplateSpecificationType extends VdcTemplateSpecificationType {
    cpuAllocationMhz?: number;
    memoryAllocationMB?: number;
    cpuGuaranteedPercentage?: number;
    vCpuInMhz?: number;
    memoryGuaranteedPercentage?: number;
}
export declare namespace AllocationPoolVdcTemplateSpecificationType {
    class Fields extends VdcTemplateSpecificationType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
        static readonly CPU_GUARANTEED_PERCENTAGE: "cpuGuaranteedPercentage";
        static readonly V_CPU_IN_MHZ: "vCpuInMhz";
        static readonly MEMORY_GUARANTEED_PERCENTAGE: "memoryGuaranteedPercentage";
    }
}

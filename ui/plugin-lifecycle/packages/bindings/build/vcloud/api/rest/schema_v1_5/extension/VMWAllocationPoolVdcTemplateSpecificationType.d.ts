import { VMWVdcTemplateSpecificationType } from "./VMWVdcTemplateSpecificationType";
export declare class VMWAllocationPoolVdcTemplateSpecificationType extends VMWVdcTemplateSpecificationType {
    cpuAllocationMhz?: number;
    memoryAllocationMB?: number;
    cpuGuaranteedPercentage?: number;
    vCpuInMhz?: number;
    memoryGuaranteedPercentage?: number;
}
export declare namespace VMWAllocationPoolVdcTemplateSpecificationType {
    class Fields extends VMWVdcTemplateSpecificationType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
        static readonly CPU_GUARANTEED_PERCENTAGE: "cpuGuaranteedPercentage";
        static readonly V_CPU_IN_MHZ: "vCpuInMhz";
        static readonly MEMORY_GUARANTEED_PERCENTAGE: "memoryGuaranteedPercentage";
    }
}

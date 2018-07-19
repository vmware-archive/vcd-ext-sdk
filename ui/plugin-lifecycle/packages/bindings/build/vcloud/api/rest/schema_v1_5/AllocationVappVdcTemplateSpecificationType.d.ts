import { VdcTemplateSpecificationType } from "./VdcTemplateSpecificationType";
export declare class AllocationVappVdcTemplateSpecificationType extends VdcTemplateSpecificationType {
    cpuAllocationMhz?: number;
    cpuLimitMhzPerVcpu?: number;
    memoryAllocationMB?: number;
    cpuGuaranteedPercentage?: number;
    memoryGuaranteedPercentage?: number;
}
export declare namespace AllocationVappVdcTemplateSpecificationType {
    class Fields extends VdcTemplateSpecificationType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly CPU_LIMIT_MHZ_PER_VCPU: "cpuLimitMhzPerVcpu";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
        static readonly CPU_GUARANTEED_PERCENTAGE: "cpuGuaranteedPercentage";
        static readonly MEMORY_GUARANTEED_PERCENTAGE: "memoryGuaranteedPercentage";
    }
}

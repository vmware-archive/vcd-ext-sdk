import { VMWVdcTemplateSpecificationType } from "./VMWVdcTemplateSpecificationType";
export declare class VMWAllocationVappVdcTemplateSpecificationType extends VMWVdcTemplateSpecificationType {
    cpuAllocationMhz?: number;
    cpuLimitMhzPerVcpu?: number;
    memoryAllocationMB?: number;
    cpuGuaranteedPercentage?: number;
    memoryGuaranteedPercentage?: number;
}
export declare namespace VMWAllocationVappVdcTemplateSpecificationType {
    class Fields extends VMWVdcTemplateSpecificationType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly CPU_LIMIT_MHZ_PER_VCPU: "cpuLimitMhzPerVcpu";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
        static readonly CPU_GUARANTEED_PERCENTAGE: "cpuGuaranteedPercentage";
        static readonly MEMORY_GUARANTEED_PERCENTAGE: "memoryGuaranteedPercentage";
    }
}

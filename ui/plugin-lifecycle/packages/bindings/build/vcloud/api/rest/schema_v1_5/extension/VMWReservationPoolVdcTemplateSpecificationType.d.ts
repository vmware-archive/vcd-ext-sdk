import { VMWVdcTemplateSpecificationType } from "./VMWVdcTemplateSpecificationType";
export declare class VMWReservationPoolVdcTemplateSpecificationType extends VMWVdcTemplateSpecificationType {
    cpuAllocationMhz?: number;
    memoryAllocationMB?: number;
}
export declare namespace VMWReservationPoolVdcTemplateSpecificationType {
    class Fields extends VMWVdcTemplateSpecificationType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
    }
}

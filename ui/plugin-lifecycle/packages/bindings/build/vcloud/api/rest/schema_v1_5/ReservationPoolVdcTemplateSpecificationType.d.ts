import { VdcTemplateSpecificationType } from "./VdcTemplateSpecificationType";
export declare class ReservationPoolVdcTemplateSpecificationType extends VdcTemplateSpecificationType {
    cpuAllocationMhz?: number;
    memoryAllocationMB?: number;
}
export declare namespace ReservationPoolVdcTemplateSpecificationType {
    class Fields extends VdcTemplateSpecificationType.Fields {
        static readonly CPU_ALLOCATION_MHZ: "cpuAllocationMhz";
        static readonly MEMORY_ALLOCATION_MB: "memoryAllocationMB";
    }
}

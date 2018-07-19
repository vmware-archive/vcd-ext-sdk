import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ReservationPoolVdcSummaryType extends VCloudExtensibleType {
    memoryConsumptionMB?: number;
    memoryReservationMB?: number;
    storageConsumptionMB?: number;
    cpuReservationMhz?: number;
    cpuConsumptionMhz?: number;
}
export declare namespace ReservationPoolVdcSummaryType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MEMORY_CONSUMPTION_MB: "memoryConsumptionMB";
        static readonly MEMORY_RESERVATION_MB: "memoryReservationMB";
        static readonly STORAGE_CONSUMPTION_MB: "storageConsumptionMB";
        static readonly CPU_RESERVATION_MHZ: "cpuReservationMhz";
        static readonly CPU_CONSUMPTION_MHZ: "cpuConsumptionMhz";
    }
}

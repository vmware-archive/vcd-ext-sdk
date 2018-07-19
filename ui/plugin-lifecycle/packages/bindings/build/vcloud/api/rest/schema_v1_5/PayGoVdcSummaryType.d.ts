import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class PayGoVdcSummaryType extends VCloudExtensibleType {
    memoryConsumptionMB?: number;
    cpuConsumptionMhz?: number;
    storageConsumptionMB?: number;
}
export declare namespace PayGoVdcSummaryType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly MEMORY_CONSUMPTION_MB: "memoryConsumptionMB";
        static readonly CPU_CONSUMPTION_MHZ: "cpuConsumptionMhz";
        static readonly STORAGE_CONSUMPTION_MB: "storageConsumptionMB";
    }
}

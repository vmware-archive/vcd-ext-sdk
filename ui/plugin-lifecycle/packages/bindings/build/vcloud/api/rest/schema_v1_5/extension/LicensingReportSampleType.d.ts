import { ManagedServerMetrics } from "./ManagedServerMetrics";
import { VirtualMachineMetrics } from "./VirtualMachineMetrics";
export declare class LicensingReportSampleType {
    managedServerMetrics?: ManagedServerMetrics;
    virtualMachineMetrics?: VirtualMachineMetrics;
    observationDate?: Date;
}
export declare namespace LicensingReportSampleType {
    class Fields {
        static readonly MANAGED_SERVER_METRICS: "managedServerMetrics";
        static readonly VIRTUAL_MACHINE_METRICS: "virtualMachineMetrics";
        static readonly OBSERVATION_DATE: "observationDate";
    }
}

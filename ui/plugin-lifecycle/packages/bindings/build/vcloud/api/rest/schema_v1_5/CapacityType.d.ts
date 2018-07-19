import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class CapacityType extends VCloudExtensibleType {
    units?: string;
    allocated?: number;
    limit?: number;
}
export declare namespace CapacityType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly UNITS: "units";
        static readonly ALLOCATED: "allocated";
        static readonly LIMIT: "limit";
    }
}

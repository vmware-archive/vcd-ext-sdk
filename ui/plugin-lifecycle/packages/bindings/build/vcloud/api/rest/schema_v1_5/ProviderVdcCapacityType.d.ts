import { VCloudExtensibleType } from "./VCloudExtensibleType";
export declare class ProviderVdcCapacityType extends VCloudExtensibleType {
    units?: string;
    allocation?: number;
    reserved?: number;
    total?: number;
    used?: number;
    overhead?: number;
}
export declare namespace ProviderVdcCapacityType {
    class Fields extends VCloudExtensibleType.Fields {
        static readonly UNITS: "units";
        static readonly ALLOCATION: "allocation";
        static readonly RESERVED: "reserved";
        static readonly TOTAL: "total";
        static readonly USED: "used";
        static readonly OVERHEAD: "overhead";
    }
}

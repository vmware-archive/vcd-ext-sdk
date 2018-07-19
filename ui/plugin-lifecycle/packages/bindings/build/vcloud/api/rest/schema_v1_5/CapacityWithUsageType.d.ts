import { CapacityType } from "./CapacityType";
export declare class CapacityWithUsageType extends CapacityType {
    reserved?: number;
    used?: number;
    overhead?: number;
}
export declare namespace CapacityWithUsageType {
    class Fields extends CapacityType.Fields {
        static readonly RESERVED: "reserved";
        static readonly USED: "used";
        static readonly OVERHEAD: "overhead";
    }
}

import { TimeType } from "./TimeType";
import { TimeUnitType } from "./TimeUnitType";
export declare class RelativeTimeType extends TimeType {
    interval?: number;
    unit?: TimeUnitType;
}
export declare namespace RelativeTimeType {
    class Fields extends TimeType.Fields {
        static readonly INTERVAL: "interval";
        static readonly UNIT: "unit";
    }
}

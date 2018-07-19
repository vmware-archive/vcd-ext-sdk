import { TimeType } from "./TimeType";
export declare class AbsoluteTimeType extends TimeType {
    time?: Date;
}
export declare namespace AbsoluteTimeType {
    class Fields extends TimeType.Fields {
        static readonly TIME: "time";
    }
}

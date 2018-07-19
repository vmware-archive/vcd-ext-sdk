export declare class CimDateTime {
    cimDateTime?: string;
    interval?: string;
    date?: Date;
    time?: Date;
    datetime?: Date;
    otherAttributes?: object;
}
export declare namespace CimDateTime {
    class Fields {
        static readonly CIM_DATE_TIME: "cimDateTime";
        static readonly INTERVAL: "interval";
        static readonly DATE: "date";
        static readonly TIME: "time";
        static readonly DATETIME: "datetime";
        static readonly OTHER_ATTRIBUTES: "otherAttributes";
    }
}

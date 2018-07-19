import { SampleType } from "./SampleType";
export declare class TimeSeriesMetricType {
    sample?: SampleType[];
    expectedInterval?: number;
    name?: string;
    unit?: string;
}
export declare namespace TimeSeriesMetricType {
    class Fields {
        static readonly SAMPLE: "sample";
        static readonly EXPECTED_INTERVAL: "expectedInterval";
        static readonly NAME: "name";
        static readonly UNIT: "unit";
    }
}

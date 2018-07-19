import { AbsoluteTimeType } from "./AbsoluteTimeType";
import { RelativeTimeType } from "./RelativeTimeType";
export declare class HistoricUsageSpecType {
    absoluteStartTime?: AbsoluteTimeType;
    relativeStartTime?: RelativeTimeType;
    absoluteEndTime?: AbsoluteTimeType;
    relativeEndTime?: RelativeTimeType;
    metricPattern?: string[];
}
export declare namespace HistoricUsageSpecType {
    class Fields {
        static readonly ABSOLUTE_START_TIME: "absoluteStartTime";
        static readonly RELATIVE_START_TIME: "relativeStartTime";
        static readonly ABSOLUTE_END_TIME: "absoluteEndTime";
        static readonly RELATIVE_END_TIME: "relativeEndTime";
        static readonly METRIC_PATTERN: "metricPattern";
    }
}

import { TimeSeriesMetricType } from "./TimeSeriesMetricType";
import { ResourceType } from "./ResourceType";
export declare class HistoricUsageType extends ResourceType {
    metricSeries?: TimeSeriesMetricType[];
}
export declare namespace HistoricUsageType {
    class Fields extends ResourceType.Fields {
        static readonly METRIC_SERIES: "metricSeries";
    }
}

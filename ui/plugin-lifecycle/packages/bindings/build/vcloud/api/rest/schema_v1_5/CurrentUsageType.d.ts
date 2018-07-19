import { ResourceType } from "./ResourceType";
import { SimpleMetricType } from "./SimpleMetricType";
export declare class CurrentUsageType extends ResourceType {
    metric?: SimpleMetricType[];
}
export declare namespace CurrentUsageType {
    class Fields extends ResourceType.Fields {
        static readonly METRIC: "metric";
    }
}

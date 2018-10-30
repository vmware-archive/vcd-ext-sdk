import {common} from "@vcd/sdk";

export type DashboardGraphType = "bar"
  | "line";

export type DashboardGraphMetric = "orgCount"
  | "vmCount"
  | "vappCount"
  | "cpuUsage"
  | "memUsage"
  | "storageUsage";

export interface DashboardGraphDefinition {
	size: "sm"|"md"|"lg",
	type: DashboardGraphType,
	metric: DashboardGraphMetric[],
}

export interface DashboardGraphsSettings {
    graphs: DashboardGraphDefinition[];
}

export interface DashboardGraphSample {
    timestamp: Date;
    orgCount: number;
    vmCount: number;
    vappCount: number;
    cpuUsage: number;
    memUsage: number;
    storageUsage: number;
}
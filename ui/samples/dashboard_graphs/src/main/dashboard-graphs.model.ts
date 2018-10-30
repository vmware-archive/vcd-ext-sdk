/** vcloud-director-ui-extension-sample-dashboard-graphs
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {common} from "@vcd/sdk";

/**
 * Supported graph types.
 */
export type DashboardGraphType = "bar"
  | "line";

/**
 * Human readable names for the supported graph types.
 */
export const typeHumanNames: {[type: string]: string} = {
    "bar": "Bar Chart (Latest Only)",
    "line": "Line Chart (Last 10 Samples)"
};

/**
 * Supported graph metrics.
 */
export type DashboardGraphMetric = "orgCount"
  | "vmCount"
  | "vappCount"
  | "cpuUsage"
  | "memUsage"
  | "storageUsage";

/**
 * Human readable names for the supported graph metrics.
 */
export const metricHumanNames: {[metric: string]: string} = {
    "orgCount": "Organization count",
    "vmCount": "VM count",
    "vappCount": "vApp count",
    "cpuUsage": "CPU Usage (MHz)",
    "memUsage": "Memory Usage (MiB)",
    "storageUsage": "Storage Usage (MiB)"
};

/**
 * Suported graph sizes.
 */
export type DashboardGraphSize = "sm"
  | "md"
  | "lg"
  | "xl";

/**
 * Human readable names for the supported graph sizes.
 */
export const sizeHumanNames: {[size: string]: string} = {
    "sm": "Small",
    "md": "Medium",
    "lg": "Large",
    "xl": "Huge"
};

/**
 * Definition of a graph.
 */
export interface DashboardGraphDefinition {
  /**
   * Size of the graph.
   */
	size: DashboardGraphSize,

  /**
   * Type of the graph.
   */
	type: DashboardGraphType,

  /**
   * Metrics that the graph displays.
   */
	metrics: DashboardGraphMetric[],
}

/**
 * Settings for the dashboard extension.
 */
export interface DashboardGraphsSettings {
    /**
     * Graphs to show on the dashboard.
     */
    graphs: DashboardGraphDefinition[];
}

/**
 * A sample of data that will be rendered on a graph.
 * Note that the numeric fields match DashboardGraphMetric. 
 */
export interface DashboardGraphSample {
    timestamp: Date;
    orgCount: number;
    vmCount: number;
    vappCount: number;
    cpuUsage: number;
    memUsage: number;
    storageUsage: number;
}
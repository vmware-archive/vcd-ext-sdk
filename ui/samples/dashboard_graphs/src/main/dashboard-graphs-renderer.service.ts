/** vcloud-director-ui-extension-sample-dashboard-graphs
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {common} from "@vcd/sdk";
import {Inject} from "@angular/core";
import {vcloud} from "@vcd/bindings";
import {VcdApiClient} from "@vcd/sdk";
import {DashboardGraphDefinition, DashboardGraphMetric, DashboardGraphSample, metricHumanNames} from "./dashboard-graphs.model";
import {DashboardGraphsSamplerService} from "./dashboard-graphs-sampler.service";
import {Chart} from "chart.js";

/**
 * Atomic increasing counter for graph renderer registrations.
 */
let maxId: number = 0;

/**
 * Internal structure that tracks registered graphs to render.
 */
interface DashboardGraphsRendererRegistration {
	id: number;
	definition: DashboardGraphDefinition;
	chart: Chart;
}

/**
 * Service that handles the rendering of all graphs.
 */
export class DashboardGraphsRendererService {
	
    /**
     * All registered graphs.
     */
	private registrations: DashboardGraphsRendererRegistration[] = [];

    /**
     * Disable chart animations, inject the sampler service, and listen for sample changes.  Whenever samples
     * change, re-render every registered graph.
     */
    constructor(@Inject(DashboardGraphsSamplerService) private graphSamplerService: DashboardGraphsSamplerService) {
        Chart.defaults.global.animation.duration = 0;
        this.graphSamplerService.samplesChanged.subscribe(() => {
            this.registrations.map((registration) => this.updateGraph(registration, this.graphSamplerService.samples));
        });
    }

    /**
     * Register a graph given its target element and definition.  Returns a unique registration ID for unregistering.
     */
    public registerGraph(target: HTMLCanvasElement, definition: DashboardGraphDefinition) {
    	const registration = this.createGraph(target, definition, this.graphSamplerService.samples);
    	this.registrations.push(registration);
    	return registration.id;
    }

    /**
     * Unregister a graph given its unique registration ID.
     */
    public unregisterGraph(id: number) {
        const index = this.registrations.findIndex((registration) => registration.id == id);
        if (index) {
        	this.registrations.splice(index, 1);
        }
    }

    /**
     * Create a graph given its target element, definition, and all historical samples.  Delegates to related methods.
     * Returns registration.
     * A good target for inheritance - exercise left to the reader :-)
     */
    private createGraph(target: HTMLCanvasElement, definition: DashboardGraphDefinition, samples: DashboardGraphSample[]) {
		switch (definition.type) {
			case "bar":
				return this.createBarGraph(target, definition, samples);
			case "line":
			default:
				return this.createLineGraph(target, definition, samples);
		}
    }

    /**
     * Update a graph given its registration and all historical samples.  Delegates to related methods.
     * A good target for inheritance - exercise left to the reader :-)
     */
	private updateGraph(registration: DashboardGraphsRendererRegistration, samples: DashboardGraphSample[]) {
		switch (registration.definition.type) {
			case "bar":
				this.updateBarGraph(registration, samples);
				break;
			case "line":
			default:
				this.updateLineGraph(registration, samples);
				break;
		}
	}

    /**
     * Create a bar graph given its target element, definition, and all historical samples.  Return a registration.
     */
    private createBarGraph(target: HTMLCanvasElement, definition: DashboardGraphDefinition, samples: DashboardGraphSample[]) {
    	const id = maxId++;
    	const data = this.createBarData(definition, samples);
        const spec = {
            type: "bar",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        };
    	const chart = new Chart(target, spec);
		return {id, definition, chart};
    }

    /**
     * Create a line graph given its target element, definition, and all historical samples.  Return a registration.
     */
    private createLineGraph(target: HTMLCanvasElement, definition: DashboardGraphDefinition, samples: DashboardGraphSample[]) {
    	const id = maxId++;
    	const data = this.createLineData(definition, samples);
        const spec = {
            type: 'line',
            data: data,
            options: {
                fill: false,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        type: 'time',
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Date",
                        }
                    }],
                    yAxes: [{
                        ticks: <any>{
                           beginAtZero: true
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Value",
                        }
                    }]
                }
            }
        };
    	const chart = new Chart(target, spec);
    	return {id, definition, chart};
    }

    /**
     * Update a bar graph given its registration and all historical samples.
     */
    private updateBarGraph(registration: DashboardGraphsRendererRegistration, samples: DashboardGraphSample[]) {
    	const data = this.createBarData(registration.definition, samples);
    	registration.chart.data = data;
    	registration.chart.update();
    }

    /**
     * Update a line graph given its registration and all historical samples.
     */
    private updateLineGraph(registration: DashboardGraphsRendererRegistration, samples: DashboardGraphSample[]) {
        const data = this.createLineData(registration.definition, samples);
    	registration.chart.data = data;
    	registration.chart.update();
    }

    /**
     * Synthesize a bar graph's data given its definition and all historical samples.
     */
    private createBarData(definition: DashboardGraphDefinition, samples: DashboardGraphSample[]) {
    	if (!samples.length) {
        	return {
	    		type: "horizontalBar",
	    		labels: definition.metrics,
	            data: {}
	    	}
    	}

    	const latestSample = samples[samples.length - 1];
    	return {
            labels: definition.metrics.map((metric) => metricHumanNames[metric]),
            datasets: [{
               label: "Current Value",
               data: definition.metrics.map((metric) => latestSample[metric])
            }]
    	}
    }

    /**
     * Synthesize a line graph's data given its definition and all historical samples.
     */
    private createLineData(definition: DashboardGraphDefinition, samples: DashboardGraphSample[]) {
    	return {
            labels: samples.map((sample) => <any>sample.timestamp),    
            datasets: definition.metrics.map((metric) => ({
                label: metricHumanNames[metric],
                data: samples.map((sample) => sample[metric])
            }))
    	}
    }
}
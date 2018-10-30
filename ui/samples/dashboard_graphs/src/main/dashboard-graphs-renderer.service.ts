import {common} from "@vcd/sdk";
import {Inject} from "@angular/core";
import {vcloud} from "@vcd/bindings";
import {VcdApiClient} from "@vcd/sdk";
import {DashboardGraphDefinition, DashboardGraphMetric, DashboardGraphSample} from "./dashboard-graphs.model";
import {DashboardGraphsSamplerService} from "./dashboard-graphs-sampler.service";
import {Chart} from "chart.js";

let maxId: number = 0;

interface DashboardGraphsRendererRegistration {
	id: number;
	definition: DashboardGraphDefinition;
	chart: Chart;
}

export class DashboardGraphsRendererService {
	
	private registrations: DashboardGraphsRendererRegistration[] = [];

    constructor(@Inject(DashboardGraphsSamplerService) private graphSamplerService: DashboardGraphsSamplerService) {
        Chart.defaults.global.animation.duration = 0;
        this.graphSamplerService.samplesChanged.subscribe(() => {
            this.registrations.map((registration) => this.updateGraph(registration, this.graphSamplerService.samples));
        });
    }

    public registerGraph(target: HTMLCanvasElement, definition: DashboardGraphDefinition) {
    	const registration = this.createGraph(target, definition, this.graphSamplerService.samples);
    	this.registrations.push(registration);
    	return registration.id;
    }

    public unregisterGraph(id: number) {
        const index = this.registrations.findIndex((registration) => registration.id == id);
        if (index) {
        	this.registrations.splice(index, 1);
        }
    }

    private createGraph(target: HTMLCanvasElement, definition: DashboardGraphDefinition, samples: DashboardGraphSample[]) {
		switch (definition.type) {
			case "bar":
				return this.createBarGraph(target, definition, samples);
			case "line":
			default:
				return this.createLineGraph(target, definition, samples);
		}
    }

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
                            labelString: "Value at Given Time",
                        }
                    }]
                }
            }
        };
    	const chart = new Chart(target, spec);
    	return {id, definition, chart};
    }

    private updateBarGraph(registration: DashboardGraphsRendererRegistration, samples: DashboardGraphSample[]) {
    	const data = this.createBarData(registration.definition, samples);
    	registration.chart.data = data;
    	registration.chart.update();
    }

    private updateLineGraph(registration: DashboardGraphsRendererRegistration, samples: DashboardGraphSample[]) {
        const data = this.createLineData(registration.definition, samples);
    	registration.chart.data = data;
    	registration.chart.update();
    }

    private createBarData(definition: DashboardGraphDefinition, samples: DashboardGraphSample[]) {
    	if (!samples.length) {
        	return {
	    		type: "horizontalBar",
	    		labels: definition.metric,
	            data: {}
	    	}
    	}

    	const latestSample = samples[samples.length - 1];
    	return {
            labels: definition.metric,
            datasets: [{
               label: "Current Value",
               data: definition.metric.map((metric) => latestSample[metric])
            }]
    	}
    }

    private createLineData(definition: DashboardGraphDefinition, samples: DashboardGraphSample[]) {
    	return {
            labels: samples.map((sample) => <any>sample.timestamp),    
            datasets: definition.metric.map((metric) => ({
                label: metric,
                data: samples.map((sample) => sample[metric])
            }))
    	}
    }
}
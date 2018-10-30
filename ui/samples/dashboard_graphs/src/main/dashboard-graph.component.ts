/** vcloud-director-ui-extension-sample-dashboard-graphs
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {common} from "@vcd/sdk";
import {DashboardGraphDefinition} from "./dashboard-graphs.model";
import {DashboardGraphsRendererService} from "./dashboard-graphs-renderer.service";

/**
 * Classes applied to the div wrapping the graph (the card body)
 */
const cssClasses = {
	"sm": "card-img graph-short",
	"md": "card-img graph-short",
	"lg": "card-img graph-tall",
	"xl": "card-img graph-tall"
}

/**
 * Component that renders a particular graph.  Takes the graph definition as input.
 */
@Component({
    selector: 'vcd-dashboard-graph',
    templateUrl: './dashboard-graph.component.html',
    styles: [`
        .graph-short {
        	height: 20em;
        }

        .graph-tall {
        	height: 30em;
        }
    `]
})
export class DashboardGraphComponent implements OnInit, OnDestroy {
    /**
     * Target element for the graph.
     */
	@ViewChild("canvas")
	private canvas: ElementRef;

    /**
     * Definition of the graph.
     */
	@Input("graphDefinition")
	private graphDefinition: DashboardGraphDefinition;

    /**
     * The registration that the renderer service provides for the graph.
     */
	private registrationId: number = null;
	
    /**
     * Event emitted if the graph's 'remove' button is clicked.
     */
    @Output("onRemove")
    readonly onRemove: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Wire in the graph renderer service.
     */
	constructor(private rendererService: DashboardGraphsRendererService) {
	}

    /**
     * Emit remove event.
     */
    onRemoveClicked() {
        this.onRemove.emit();
    }

    /**
     * Register the graph and the target element with the graph renderer service.
     */
    ngOnInit() {
        this.registrationId = this.rendererService.registerGraph(this.canvas.nativeElement, this.graphDefinition);
    }

    /**
     * Unregister the graph with the graph renderer service.
     */
	ngOnDestroy() {
        if (this.registrationId !== null) {
            this.rendererService.unregisterGraph(this.registrationId);
            this.registrationId = null;
		}
    }

    /**
     * Helper to get the CSS class to apply to the graph container div.
     */
    get cssClass() {
    	const size = (this.graphDefinition && this.graphDefinition.size) || "xl";
    	return cssClasses[size] || cssClasses["xl"];
    }
}

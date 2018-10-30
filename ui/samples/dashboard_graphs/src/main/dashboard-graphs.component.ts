/** vcloud-director-ui-extension-sample-about-page
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, Inject, ViewChild} from "@angular/core";
import {common} from "@vcd/sdk";
import {AddDashboardGraphModalComponent} from "./add-dashboard-graph-modal.component";
import {DashboardGraphDefinition} from "./dashboard-graphs.model";
import {DashboardGraphsSettingsService} from "./dashboard-graphs-settings.service";

/**
 * CSS classes that get added to a graph component.
 */
const cssClasses = {
	"sm": "col-xs-12 col-s-6 col-m-4 col-lg-4",
	"md": "col-xs-12 col-s-12 col-m-6 col-lg-6",
	"lg": "col-xs-12 col-s-12 col-m-12 col-lg-6",
	"xl": "col-xs-12 col-s-12 col-m-12 col-lg-12"
}

/**
 * Display all registered graphs, formatted accordingly for the dashboard.
 */
@Component({
    selector: 'vcd-dashboard-graphs',
    templateUrl: './dashboard-graphs.component.html'
})
export class DashboardGraphsComponent {
    /**
     * The name from the extension's manifest.
     */
	private name: string;

    /**
     * The description from the extension's manifest.
     */
	private description: string;

    /**
     * The defined graphs to render.
     */
    private graphDefinitions: DashboardGraphDefinition[] = [];

    /**
     * Modal allowing for adding a new graph.
     */
    @ViewChild("addModal") addModal: AddDashboardGraphModalComponent;

    /**
     * Inject the manifest and extract the name and description.
     * Inject the settings service and extract the defined graphs.
     * Listen to settings changes, and on any change extract the new defined graphs so they will be displayed.
     */
	constructor(@Inject(common.EXTENSION_POINT_MANIFEST) manifest: common.ExtensionPointManifest,
		@Inject(DashboardGraphsSettingsService) private graphSettingsService: DashboardGraphsSettingsService) {
		this.name = manifest.name;
		this.description = manifest.description;
        this.graphDefinitions = graphSettingsService.graphs;
        this.graphSettingsService.settingsChanged.subscribe(() => {
        	this.graphDefinitions = graphSettingsService.graphs;
        });
	}

    /**
     * Open the add graph modal.
     */
    onAddGraphClicked() {
        this.addModal.open();
    }

    /**
     * Open the remove graph modal.
     */
    onGraphRemoved(index: number) {
    	this.graphSettingsService.removeGraph(index);
    }

    /**
     * Helper function to get the CSS class for the graph component given its definition.
     */
	cssClassFor(graphDefinition: DashboardGraphDefinition) {
        return cssClasses[graphDefinition.size] || cssClasses["xl"];
	}

}

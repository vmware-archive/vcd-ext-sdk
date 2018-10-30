/** vcloud-director-ui-extension-sample-about-page
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, Inject, ViewChild} from "@angular/core";
import {common} from "@vcd/sdk";
import {AddDashboardGraphModalComponent} from "./add-dashboard-graph-modal.component";
import {DashboardGraphDefinition} from "./dashboard-graphs.model";
import {DashboardGraphsSettingsService} from "./dashboard-graphs-settings.service";

const cssClasses = {
	"sm": "col-xs-12 col-s-6 col-m-4 col-lg-4",
	"md": "col-xs-12 col-s-12 col-m-6 col-lg-6",
	"lg": "col-xs-12 col-s-12 col-m-12 col-lg-6",
	"xl": "col-xs-12 col-s-12 col-m-12 col-lg-12"
}

@Component({
    selector: 'vcd-dashboard-graphs',
    templateUrl: './dashboard-graphs.component.html'
})
export class DashboardGraphsComponent {
	private name: string;
	private description: string;
    private graphDefinitions: DashboardGraphDefinition[] = [];

    @ViewChild("addModal") addModal: AddDashboardGraphModalComponent;

	constructor(@Inject(common.EXTENSION_POINT_MANIFEST) manifest: common.ExtensionPointManifest,
		@Inject(DashboardGraphsSettingsService) private graphSettingsService: DashboardGraphsSettingsService) {
		this.name = manifest.name;
		this.description = manifest.description;
        this.graphDefinitions = graphSettingsService.graphs;
        this.graphSettingsService.settingsChanged.subscribe(() => {
        	this.graphDefinitions = graphSettingsService.graphs;
        });
	}

    onAddGraphClicked() {
        this.addModal.open();
    }

    onGraphRemoved(index: number) {
    	this.graphSettingsService.removeGraph(index);
    }

	cssClassFor(graphDefinition: DashboardGraphDefinition) {
        return cssClasses[graphDefinition.size] || cssClasses["xl"];
	}

}

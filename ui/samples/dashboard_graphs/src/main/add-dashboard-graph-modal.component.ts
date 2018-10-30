/** vcloud-director-ui-extension-sample-dashboard-graphs
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {common} from "@vcd/sdk";
import {DashboardGraphDefinition, typeHumanNames, metricHumanNames, sizeHumanNames} from "./dashboard-graphs.model";
import {DashboardGraphsSettingsService} from "./dashboard-graphs-settings.service";

/**
 * Simple interface holding a value and label for a select box option
 */
interface SelectOption {
    /**
     * Value for the <option> tag
     */
    value: string;

    /**
     * Label for the <option> tag
     */
    label: string;
}

/**
 * Modal to allow adding a dashboard graph.
 */
@Component({
    selector: 'vcd-add-dashboard-graph-modal',
    templateUrl: './add-dashboard-graph-modal.component.html'
})
export class AddDashboardGraphModalComponent {
    /**
     * Known types to be selected
     */
    readonly types: SelectOption[] =
       Object.keys(typeHumanNames).map((value) => ({value, label: typeHumanNames[value]}));

    /**
     * Known sizes to be selected
     */
    readonly sizes: SelectOption[] =
       Object.keys(sizeHumanNames).map((value) => ({value, label: sizeHumanNames[value]}));

    /**
     * Known metrics to be selected
     */
    readonly metrics: SelectOption[] =
       Object.keys(metricHumanNames).map((value) => ({value, label: metricHumanNames[value]}))

    /**
     * Whether or not the dialog is opened
     */
    opened = false;

    /**
     * Form - matches the DashboardGraphDefinition model
     */
    formGroup = new FormGroup({
        "type": new FormControl("bar"),
        "size": new FormControl("md"),
        "metrics": new FormControl(["orgCount"])
    });
	
    /**
     * Constructur - inject the settings service
     */
    constructor(private settingsService: DashboardGraphsSettingsService) {
    }

    /**
     * Open the modal and reset the form to defaults
     */
    open() {
        this.formGroup.reset({
            "type": "bar",
            "size": "md",
            "metrics": ["orgCount"]
        })
        this.opened = true;
    }

    /**
     * Close modal
     */
    onCancelClicked() {
        this.opened =false;
    }

    /**
     * Register the new graph definition with the settings service and close modal
     */
    onSaveClicked() {
        const value = this.formGroup.value;
        const definition: DashboardGraphDefinition = {...this.formGroup.value};
        this.settingsService.addGraph(definition);
        this.opened = false;
    }

}

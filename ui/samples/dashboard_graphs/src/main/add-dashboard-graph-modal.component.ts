/** vcloud-director-ui-extension-sample-dashboard-graphs
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {common} from "@vcd/sdk";
import {DashboardGraphDefinition, typeHumanNames, metricHumanNames, sizeHumanNames} from "./dashboard-graphs.model";
import {DashboardGraphsSettingsService} from "./dashboard-graphs-settings.service";

interface ModalComboOption {
    value: string;
    label: string;
}

@Component({
    selector: 'vcd-add-dashboard-graph-modal',
    templateUrl: './add-dashboard-graph-modal.component.html'
})
export class AddDashboardGraphModalComponent {
    readonly types: ModalComboOption[] =
       Object.keys(typeHumanNames).map((value) => ({value, label: typeHumanNames[value]}));
    readonly sizes: ModalComboOption[] =
       Object.keys(sizeHumanNames).map((value) => ({value, label: sizeHumanNames[value]}));
    readonly metrics: ModalComboOption[] =
       Object.keys(metricHumanNames).map((value) => ({value, label: metricHumanNames[value]}))

    opened = false;
    formGroup = new FormGroup({
        "type": new FormControl("bar"),
        "size": new FormControl("md"),
        "metrics": new FormControl(["orgCount"])
    });
	
    constructor(private settingsService: DashboardGraphsSettingsService) {
    }

    open() {
        this.formGroup.reset({
            "type": "bar",
            "size": "md",
            "metrics": ["orgCount"]
        })
        this.opened = true;
    }

    onCancelClicked() {
        this.opened =false;
    }

    onSaveClicked() {
        const value = this.formGroup.value;
        const definition: DashboardGraphDefinition = {...this.formGroup.value};
        this.settingsService.addGraph(definition);
        this.opened = false;
    }

}

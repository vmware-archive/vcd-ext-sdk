import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {common} from "@vcd/sdk";
import {DashboardGraphDefinition} from "./dashboard-graphs.model";
import {DashboardGraphsSettingsService} from "./dashboard-graphs-settings.service";

@Component({
    selector: 'vcd-add-dashboard-graph-modal',
    templateUrl: './add-dashboard-graph-modal.component.html'
})
export class AddDashboardGraphModalComponent {

    opened = false;
    formGroup = new FormGroup({
        "type": new FormControl("bar"),
        "size": new FormControl("md"),
        "metric": new FormControl(["orgCount"])
    });
	
    constructor(private settingsService: DashboardGraphsSettingsService) {
    }

    open() {
        this.formGroup.reset({
            "type": "bar",
            "size": "md",
            "metric": ["orgCount"]
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

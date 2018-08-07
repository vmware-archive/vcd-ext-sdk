/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { ChangeScopeService } from "../../services/change-scope.service";
import { PluginManager } from "../../services/plugin-manager.service";
import { UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html"
})
export class ChangeScope implements OnInit {
    public feedback = new ScopeFeedback();
    public loading = false;
    public alertMessage: string;
    public hasToRefresh = false;
    public alertClasses: string;
    private _open = false;

    @Input()
    set open(val: boolean) {
        this._open = val;
    }
    @Output() openChange = new EventEmitter<boolean>();

    constructor(
        private changeScopeService: ChangeScopeService,
        private pluginManager: PluginManager
    ) { }

    ngOnInit() {
        this.alertClasses = "alert-info";
    }

    get open(): boolean {
        return this._open;
    }

    /**
     * Change the scope of the plugin (ex: tenant / provider)
     */
    public changeScope(): void {
        this.alertMessage = null;
        this.alertClasses = "alert-info";
        // Validate change scope action
        // Collect the plugins which will be update
        const pluginsToBeUpdated: UiPluginMetadataResponse[] = [];
        this.pluginManager.selectedPlugins.forEach((selectedPlugin: UiPluginMetadataResponse) => {
            // Already in state
            if (
                (selectedPlugin.tenantScoped === (this.feedback.scope.indexOf("tenant") !== -1)) &&
                (selectedPlugin.providerScoped === (this.feedback.scope.indexOf("service-provider") !== -1))
            ) {
                return;
            }

            pluginsToBeUpdated.push(selectedPlugin);
        });

        if (pluginsToBeUpdated.length < 1) {
            this.alertMessage = "All plugins are in this state already!";
            return;
        }

        if (pluginsToBeUpdated.length !== this.pluginManager.selectedPlugins.length) {
            this.alertMessage = `Only ${pluginsToBeUpdated.length} plugins will be scope changed, others are already in this state.`;
        }

        // Show spinner
        this.loading = true;
        // Start the change scope action
        const subs = this.changeScopeService.changeScope(pluginsToBeUpdated, this.feedback.scope, this.pluginManager.baseUrl)
            .subscribe((res) => {
                this.hasToRefresh = true;
            }, (error: Error) => {
                this.alertMessage = error.message;
                this.alertClasses = "alert-danger";
            }, () => {
                this.loading = false;
                subs.unsubscribe();
            });
    }

    /**
     * Close the change scope modal.
     */
    public onClose(): void {
        this.open = false;
        this.feedback.reset();
        this.openChange.emit(false);

        if (this.hasToRefresh) {
            this.hasToRefresh = false;
            // Refresh the list of the plugins
            this.pluginManager.refresh();
        }
    }
}

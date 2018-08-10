/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { PluginManager } from "../../services/plugin-manager.service";
import { ChangeOrgScopeService } from "../../services/change-org-scope.service";
import { Subscription, Observable } from "rxjs";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";
import { OrganisationService } from "../../services/organisation.service";
import { Organisation } from "../../interfaces/Organisation";
import { UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model";

@Component({
    selector: "vcd-change-org-scope",
    templateUrl: "./change-org-scope.component.html",
    styleUrls: ["./change-org-scope.component.scss"]
})
export class ChangeOrgScope implements OnInit {
    private _state = false;
    private _action: string;
    public feedback: ScopeFeedback = new ScopeFeedback();
    public showTracker: boolean;
    public hasToRefresh = false;
    public listOfOrgsPerPlugin: ChangeScopeItem[];
    public orgs: Organisation[];
    public plugins: UiPluginMetadataResponse[];
    public alertMessage: string;
    public alertClasses: string;

    public watchSourceDataSub: Subscription;

    @Input()
    set state (val: boolean) {
        if (val === false) {
            // Reset the feedback data
            this.feedback.reset();

            if (this.watchSourceDataSub) {
                this.watchSourceDataSub.unsubscribe();
            }
        }

        if (val === true) {
            // Hide tracker
            this.showTracker = false;
        }

        this._state = val;
    }
    @Output() public stateChange = new EventEmitter<boolean>();

    @Input()
    set action(val: string) {
        this._action = val;
        this.loadListOfOrgsPerPlugin();
    }

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private pluginManager: PluginManager,
        private changeOrgScopeService: ChangeOrgScopeService,
        private orgService: OrganisationService
    ) {}

    public ngOnInit(): void {
        this.showTracker = false;
        this.alertClasses = "alert-info";
    }

    get state (): boolean {
        return this._state;
    }

    get action (): string {
        return this._action;
    }

    public resetAlertPayload(): void {
        this.alertMessage = null;
        this.alertClasses = "alert-info";
    }

    /**
     * Reset values before each update
     */

    public beforeUpdate(): void {
        this.alertMessage = null;
        this.alertClasses = "alert-info";

        this.hasToRefresh = true;
        this.showTracker = true;
    }

    /**
     * Trigger update action
     */
    public onUpdate(): void {
        this.resetAlertPayload();

        if (this.feedback.forAllOrgs && this.action === "publish") {
            const subs = this.pluginManager.publishPluginForAllTenants(true)
            .map((res, index) => {
                if (index === 0) {
                    this.beforeUpdate();
                }
                return res;
            })
            .subscribe((res) => {
                this.changeOrgScopeService.handleCompletedRequest(res);
            }, (error) => {
                console.error(error);
                this.alertMessage = error.message;
                this.alertClasses = "alert-danger";
            }, () => {
                subs.unsubscribe();
            });
            return;
        }

        if (this.feedback.forAllOrgs && this.action === "unpublish") {
            const subs = this.pluginManager.unpublishPluginForAllTenants(true)
            .map((res, index) => {
                if (index === 0) {
                    this.beforeUpdate();
                }
                return res;
            })
            .subscribe((res) => {
                this.changeOrgScopeService.handleCompletedRequest(res);
            }, (error) => {
                console.error(error);
                this.alertMessage = error.message;
                this.alertClasses = "alert-danger";
            }, () => {
                subs.unsubscribe();
            });
            return;
        }

        if (!this.feedback.forAllOrgs && this.feedback.data.length > 0) {
            const subs = this.pluginManager.handleMixedScope(this.plugins, this.feedback, true)
            .map((res, index) => {
                if (index === 0) {
                    this.beforeUpdate();
                }
                return res;
            })
            .subscribe((res) => {
                this.changeOrgScopeService.handleCompletedRequest(res);
            }, (error) => {
                console.error(error);
                this.alertMessage = error.message;
                this.alertClasses = "alert-danger";
            }, () => {
                subs.unsubscribe();
            });
            return;
        }

        this.alertMessage = "Please select some of the options below...";
        this.alertClasses = "alert-info";
    }

    /**
     * Close the chage org scope modal and notify all listeners
     */
    public onClose(): void {
        this.state = false;

        this.stateChange.emit(false);
        if (this.hasToRefresh) {
            this.hasToRefresh = false;
            this.pluginManager.refresh();
        }
    }

    /**
     * Load all organisations plugins and watch them for changes.
     */
    public loadListOfOrgsPerPlugin(): void {
        this.loadOrgs();
        this.loadPlugins();
        this.watchSourceData();
        this.populateList();
    }

    /**
     * Get all organistaions.
     */
    public loadOrgs(): void {
        this.orgs = this.orgService.orgs;
    }

    /**
     * Get all plugins.
     */
    public loadPlugins(): void {
        this.plugins = this.pluginManager.selectedPlugins;
    }

    /**
     * Observe the lists of organisations and plugins.
     */
    public watchSourceData(): void {
        // Merge the plugin and organisation observables
        this.watchSourceDataSub = Observable.merge<UiPluginMetadataResponse[], Organisation[]>(
            this.pluginManager.watchSelectedPlugins(),
            this.orgService.watchOrgs()
        ).subscribe((data) => {
            if (data.length === 0) {
                return;
            }

            // Assign plugins list
            if (Object.keys(data[0]).indexOf("pluginName") !== -1) {
                this.plugins = <UiPluginMetadataResponse[]>data;
            }

            // Assaign organisations list
            if (Object.keys(data[0]).indexOf("displayName") !== -1) {
                this.orgs = <Organisation[]>data;
            }

            // Populate the list with new data
            this.populateList();
        }, (error) => {
            this.alertMessage = error.message;
            this.alertClasses = "alert-danger";
        });
    }

    /**
     * Populate the list with organisations and plugins data.
     */
    public populateList(): void {
        this.listOfOrgsPerPlugin = [];
        this.orgs.forEach((org: Organisation) => {
            this.plugins.forEach(plugin => {
                this.listOfOrgsPerPlugin.push({ orgName: org.name, plugin: plugin.pluginName, action: this.action });
            });
        });
    }
}

/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { PluginManager } from "../../services/plugin-manager.service";
import { Subscription, Observable } from "rxjs";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";
import { TenantService } from "../../services/tenant.service";
import { UiPluginMetadataResponse, EntityReference2 } from "@vcd/bindings/vcloud/rest/openapi/model";
import { PluginService } from "../../services/plugin.service";
import { difference } from "../../helpers/set-helpers";
import { QueryResultOrgRecordType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

@Component({
    selector: "vcd-change-tenant-scope",
    templateUrl: "./change-tenant-scope.component.html",
    styleUrls: ["./change-tenant-scope.component.scss"]
})
export class ChangeTenantScope implements OnInit {
    private _state = false;
    public feedback: ScopeFeedback = new ScopeFeedback();
    // public showTracker: boolean;
    public hasToRefresh = false;
    public listOfOrgsPerPlugin: ChangeScopeItem[];
    public orgs: QueryResultOrgRecordType[] = [];
    public plugins: UiPluginMetadataResponse[] = [];
    public alertMessage: string;
    public alertClasses: string;
    public copyOfTheFirstPreSelectedPlugins: Set<ChangeScopeItem>;
    public fetching: boolean;

    public watchSourceDataSub: Subscription;

    @Input()
    /**
     * Set the state of the modal
     */
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
            // this.showTracker = false;
            this.loadListOfOrgsPerPlugin();
            this.initialOptionPreSelect();
        }

        this._state = val;
    }
    @Output() public stateChange = new EventEmitter<boolean>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private pluginManager: PluginManager,
        private pluginService: PluginService,
        private orgService: TenantService
    ) {}

    public ngOnInit(): void {
        // this.showTracker = false;
        this.alertClasses = "alert-info";
    }

    /**
     * Get the state of the modal
     */
    get state (): boolean {
        return this._state;
    }

    /**
     * Pre-selects the option related to the
     * feedback data list size
     */
    public initialOptionPreSelect(): void {
        this.feedback.unpublishForAllTenants = false;
        this.feedback.publishForAllTenants = false;
    }

    /**
     * Reset alert message payload
     */
    public resetAlertPayload(): void {
        this.alertMessage = null;
        this.alertClasses = "alert-info";
    }

    /**
     * Reset values before each update
     */

    public beforeUpdate(): void {
        this.resetAlertPayload();

        this.hasToRefresh = true;
        // this.showTracker = true;
    }

    /**
     * Publish for all tenants in parallel
     */
    public publishForAllTenants(): void {
        this.fetching = true;

        const subs = this.pluginManager.publishPluginForAllTenants(false)
        .map((res, index) => {
            if (index === 0) {
                this.beforeUpdate();
            }
            return res;
        })
        .subscribe((res) => {
        }, (error) => {
            this.fetching = false;
            this.alertMessage = error.message;
            this.alertClasses = "alert-danger";
        }, () => {
            this.fetching = false;
            this.feedback.reset();
            this.preSelect();
            subs.unsubscribe();
        });
    }

    /**
     * Unpublish for all tenants in parallel
     */
    public unpublishForAllTenants(): void {
        this.fetching = true;
        const subs = this.pluginManager.unpublishPluginForAllTenants(false)
            .map((res, index) => {
                if (index === 0) {
                    this.beforeUpdate();
                }
                return res;
            })
            .subscribe((res) => {
            }, (error) => {
                this.fetching = false;
                this.alertMessage = error.message;
                this.alertClasses = "alert-danger";
            }, () => {
                this.fetching = false;
                this.feedback.reset();
                this.preSelect();
                subs.unsubscribe();
            });
    }

    /**
     * Trigger update action
     */
    public onUpdate(): void {
        this.resetAlertPayload();

        if (this.feedback.publishForAllTenants) {
           this.publishForAllTenants();
            return;
        }

        if (this.feedback.unpublishForAllTenants) {
            this.unpublishForAllTenants();
            return;
        }

        // Create set from origin feedback data
        const feedbackDataSet = new Set<ChangeScopeItem>(this.feedback.data);

        /*
        Create set which is the difference between original feedback
        data and snapshot of the first state of the grid
        */
        const pluginsToBePublished: Set<ChangeScopeItem> = difference<ChangeScopeItem>(
            feedbackDataSet,
            this.copyOfTheFirstPreSelectedPlugins
        );
        // Make all items in this set ready to publish
        pluginsToBePublished.forEach((item: ChangeScopeItem) => {
            item.action = "publish";
        });

        /*
        Create set which is the difference between snapshot of the first state of the grid
        data and original feedback
        */
        const pluginsToBeUnpublished: Set<ChangeScopeItem> = difference<ChangeScopeItem>(
            this.copyOfTheFirstPreSelectedPlugins,
            feedbackDataSet
        );
        // Make all items in this set ready to unpublish
        pluginsToBeUnpublished.forEach((item: ChangeScopeItem) => {
            item.action = "unpublish";
        });

        // Create copy of the feedback object
        const feedbackCopy = Object.assign(new ScopeFeedback(), this.feedback);
        // Set the data of that object to empty array
        feedbackCopy.data = [];

        /*
        If size of the plugins to be updated set is greather then 0
        create array from it and assign it to feedback copy data array
        */
        if (pluginsToBePublished.size > 0) {
            feedbackCopy.data = Array.from(pluginsToBePublished);
        }

        /*
        If size of the plugins to be deleted set is greather then 0
        and the initial state snapshot size is greather then 0,
        create array from it and concat with data array of feedback copy object
        */
        if (pluginsToBeUnpublished.size > 0 && this.copyOfTheFirstPreSelectedPlugins.size > 0) {
            feedbackCopy.data = feedbackCopy.data.concat(Array.from(pluginsToBeUnpublished));
        }

        /**
         * If there is any plugins to be updated, trigger the update requests in parallel
         */
        if (feedbackCopy.data.length > 0) {
            this.fetching = true;
            this.beforeUpdate();
            const subs = this.pluginManager.handleMixedScope(
                this.plugins,
                feedbackCopy,
                false
            )
            .subscribe((res) => {
            }, (error) => {
                this.fetching = false;
                this.alertMessage = error.message;
                this.alertClasses = "alert-danger";
            }, () => {
                this.fetching = false;
                this.feedback.reset();
                this.preSelect();
                subs.unsubscribe();
            });
            return;
        }

        // If no options are selected show error message
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
     * Load all tenants plugins and watch them for changes.
     */
    public loadListOfOrgsPerPlugin(): void {
        this.loadPlugins();
        this.watchSourceData();
    }

    /**
     * Get all plugins.
     */
    public loadPlugins(): void {
        this.plugins = this.pluginManager.selectedPlugins;
    }

    /**
     * Observe the lists of tenants and plugins.
     */
    public watchSourceData(): void {
        // Merge the plugin and tenant observables
        this.watchSourceDataSub = Observable.merge<UiPluginMetadataResponse[], QueryResultOrgRecordType[]>(
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

            // Assaign tenants list
            if (Object.keys(data[0]).indexOf("displayName") !== -1) {
                this.orgs = <QueryResultOrgRecordType[]>data;
            }

            if (this.orgs.length < 1) {
                return;
            }

            // Populate the list with new data
            this.populateList();
        }, (error) => {
            this.alertMessage = error.message;
            this.alertClasses = "alert-danger";
        }, () => {
            // Handle complete
        });
    }

    /**
     * Populate the list with tenants and plugins data.
     */
    public populateList(): void {
        this.listOfOrgsPerPlugin = [];

        this.orgs.forEach((org: QueryResultOrgRecordType) => {
            this.plugins.forEach(plugin => {
                this.listOfOrgsPerPlugin.push({ orgName: org.name, plugin, action: "publish" });
            });
        });

        this.preSelect();
    }

    /**
     * Pre-selects already published tenant - plugin pairs.
     */
    public preSelect(): void {
        // Reset alert data
        this.resetAlertPayload();
        this.fetching = true;

        // Loop through plugins array
        this.plugins.forEach((plugin: UiPluginMetadataResponse, index: number) => {
            // Get tenants for which plugin is published
            this.pluginService.getPluginTenants(plugin.id)
            .subscribe((responses: EntityReference2[]) => {
                // Loop through the tenants
                responses.forEach((res: EntityReference2) => {
                    // Search for tenant plugin pair with this tenant and plugin name
                    const found = this.listOfOrgsPerPlugin.find((item) => {
                        return item.orgName === res.name && item.plugin.pluginName === plugin.pluginName;
                    });

                    // If tenant plugin pair is found add it to the selected rows
                    if (found) {
                        this.feedback.addNewOrg(found);
                    }
                });

                // After all requests made, create snapshot of the initial state of the selected datagrid rows
                this.copyOfTheFirstPreSelectedPlugins = new Set<ChangeScopeItem>([...this.feedback.data]);

                if (index === this.plugins.length - 1) {
                    this.fetching = false;
                }
            }, (error) => {
                // Handle error
                console.error(error);
                this.alertMessage = error.message;
                this.alertClasses = "alert-danger";
            }, () => {
                // Handle complete
            });
        });
    }
}

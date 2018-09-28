/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";
import { PluginManager } from "../../services/plugin-manager.service";
import { Subscription } from "rxjs";
import { PluginValidator } from "../../classes/plugin-validator";
import { UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model/uiPluginMetadataResponse";
import { ActionVerifierService } from "../../common-vcd/action-verifier.service";

interface SubjectModalData {
    accept: boolean;
}

@Component({
    selector: "vcd-plugin-status",
    templateUrl: "./status.component.html",
    styleUrls: ["./status.component.scss"]
})
export class StatusComponent implements OnInit, OnDestroy {
    public _selected: UiPluginMetadataResponse[];
    public plugins: UiPluginMetadataResponse[];
    public changeScopeState = false;
    public wantToUpload: boolean;
    public isLoading: boolean;
    public openChangeScope = false;
    public errorMessage: string;
    public openErrorNotifyer: boolean;
    // Flag which toggles the enable button
    public canEnable: boolean;
    // Flag which toggles the disable button
    public canDisable: boolean;

    public watchPluginListSub: Subscription;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private pluginManager: PluginManager,
        private action: ActionVerifierService
    ) { }

    public ngOnInit() {
        this.selected = [];
        this.watchPluginsList();
        this.plugins = this.pluginManager.getPlugins();
        this.wantToUpload = false;
    }

    public ngOnDestroy(): void {
        this.watchPluginListSub.unsubscribe();
    }

    get selected(): UiPluginMetadataResponse[] {
        return this._selected;
    }

    set selected(plugins: UiPluginMetadataResponse[]) {
        this._selected = plugins;
        this.pluginManager.selectedPlugins = this._selected;

        this.canEnable = false;
        this.canDisable = false;

        if (this.selected.length === 1) {
            if (this.selected[0].enabled === true) {
                this.canEnable = false;
            } else {
                this.canEnable = true;
            }

            this.canDisable = !this.canEnable;
            return;
        }


        let countOfEnabled = 0;
        let countOfDisabled = 0;
        this.selected.forEach((plugin) => {
            plugin.enabled === true ? ++countOfEnabled : ++countOfDisabled;
        });

        if (countOfEnabled === 0) {
            this.canEnable = true;
            return;
        }

        if (countOfDisabled === 0) {
            this.canDisable = true;
            return;
        }

        this.canEnable = true;
        this.canDisable = true;
    }

    /**
     * Observe the plugin list in plugin manager service
     */
    public watchPluginsList(): void {
        this.watchPluginListSub = this.pluginManager.watchPluginList().subscribe((plugins: UiPluginMetadataResponse[]) => {
            this.plugins = plugins;
        });
    }

    // Validate enable or disable action
    public validateAction(hasToBe: boolean): Promise<void> {
        return PluginValidator.validateDisableEnableAction(this.selected, hasToBe, this.action.openModal.bind(this.action));
    }

    /**
     * Refresh plugin list
     */
    public onRefresh() {
        this.errorMessage = null;
        this.loading();

        this.pluginManager.refresh()
            .then(() => {
                this.endLoading();
            })
            .catch((error) => {
                this.openErrorNotifyer = true;
                this.errorMessage = error.message;
            });
    }

    /**
     * Disable all selected plugins
     */
    public onDisable(): void {
        this.errorMessage = null;

        const onDisableSub = this.action.openModal({
            title: "Disable",
            body: "Are you sure you want to disable the plugins?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        })
        .subscribe((modalSubjectData) => {
            // If user doesn't authorize the action
            if (modalSubjectData.accept === false) {
                this.action.closeModal();
                onDisableSub.unsubscribe();
                return;
            }

            // Close modal
            this.action.closeModal();
            // Clear subscriptions
            onDisableSub.unsubscribe();

            // Validate the action
            this.validateAction(false)
            .then(() => {
                // Show spinner
                this.loading();

                return this.pluginManager
                    // Start the disable process
                    .disablePlugins()
                    .toPromise();
            })
            .then(() => {
                // Refresh the list of plugins
                return this.pluginManager.refresh();
            })
            .then(() => {
                // Hide spinner
                this.endLoading();
            })
            .catch((error: Error) => {
                this.endLoading();
                this.openErrorNotifyer = true;
                this.errorMessage = error.message;
            });
        });
    }

    /**
     * Enable all selected plugins
     */
    public onEnable(): void {
        this.errorMessage = null;

        const onEnableSub = this.action.openModal({
            title: "Enable",
            body: "Are you sure you want to enable the plugins?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        })
        .subscribe((modalSubjectData) => {
            // If user doesn't authorize the action
            if (modalSubjectData.accept === false) {
                this.action.closeModal();
                onEnableSub.unsubscribe();
                return;
            }

            // Close modal
            this.action.closeModal();
            // Clear subscriptions
            onEnableSub.unsubscribe();

            // Validate the list of plugins
            this.validateAction(true)
            .then(() => {
                // Show spinner
                this.loading();
                return this.pluginManager
                    // Start enable process
                    .enablePlugins()
                    .toPromise();
            })
            .then(() => {
                // Refresh the plugins list
                return this.pluginManager.refresh();
            })
            .then(() => {
                // Hide the spinner
                this.endLoading();
            })
            .catch((error) => {
                // Hide the spinner
                this.endLoading();
                this.openErrorNotifyer = true;
                this.errorMessage = error.message;
            });
        });
    }

    /**
     * Starts delete action on selected plugins.
     */
    public onDelete(): void {
        if (this.selected.length < 1) {
            return;
        }
        this.errorMessage = null;
        let onDeleteSub: Subscription;
        // Open modal to notify the user
        onDeleteSub = this.action.openModal({
            title: "Delete",
            body: "Are you sure you want to delete the plugins?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        })
            .subscribe((modalSubjectData: SubjectModalData) => {
                // If user doesn't authorize the action
                if (modalSubjectData.accept === false) {
                    this.action.closeModal();
                    onDeleteSub.unsubscribe();
                    return;
                }

                this.action.closeModal();
                onDeleteSub.unsubscribe();
                this.loading();

                const deleteSubs = this.pluginManager
                    // Delete all selected plugins
                    .deletePlugins()
                    .subscribe(() => {
                        // Refresh the list of plugins
                        this.pluginManager.refresh();
                        // Close the loader
                        this.endLoading();
                    }, (error) => {
                        this.endLoading();
                        this.openErrorNotifyer = true;
                        this.errorMessage = error.message;
                    }, () => {
                        // Completed!
                        this.endLoading();
                        deleteSubs.unsubscribe();
                    });
            });
    }

    /**
     * Open upload modal.
     */
    public onUpload(): void {
        this.wantToUpload = true;
    }

    /**
     * Open the modal for org scope changing.
     */
    public openChangeOrgScope(): void {
        this.changeScopeState = true;
    }

    /**
     * Open the modal for scope changing.
     */
    public changeScope() {
        this.openChangeScope = true;
    }

    /**
     * Show the loader on the screen.
     */
    public loading(): void {
        this.isLoading = true;
    }

    /**
     * Removes loader from the screen.
     */
    public endLoading(): void {
        this.isLoading = false;
    }
}

/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { PluginManager } from "../../services/plugin-manager.service";
import { Subscription, Observable, Subject } from "rxjs";
import { ModalData, ModalWindow } from "../../interfaces/Modal";
import { PluginValidator } from "../../classes/plugin-validator";
import { ChangeOrgScopeService } from "../../services/change-org-scope.service";
import { ChangeScopeRequestTo } from "../../interfaces/ChangeScopeRequestTo";
import { Response } from "@angular/http";
import { UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model/uiPluginMetadataResponse";

interface SubjectModalData {
    accept: boolean;
}

@Component({
    selector: "vcd-plugin-status",
    templateUrl: "./status.component.html"
})
export class StatusComponent implements OnInit, OnDestroy {
    public _selected: UiPluginMetadataResponse[];
    public plugins: UiPluginMetadataResponse[];
    public modal: ModalData;
    public changeScopeState = false;
    public wantToUpload: boolean;
    public isLoading: boolean;
    public action: string;
    public showTracker = false;
    public openChangeScope = false;
    public errorMessage: string;
    public openErrorNotifyer: boolean;
    public watchPluginListSub: Subscription;

    public modalSubject = new Subject<SubjectModalData>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private pluginManager: PluginManager,
        private changeOrgScopeService: ChangeOrgScopeService
    ) { }

    public ngOnInit() {
        this.selected = [];
        this.modal = new ModalWindow();
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
    }

    public getOpened(): boolean {
        return this.modal.opened;
    }

    public setOpened(val: boolean): void {
        this.modal.waitToClose = false;
        this.modal.opened = val;
    }

    /**
     * The method will notify all listers for this action.
     * @param accept value to be emitted to all listeners.
     */
    public emitAndClose(accept: boolean): void {
        if (!this.modal.waitToClose) {
            this.setOpened(false);
        }
        this.modalSubject.next({ accept });
    }

    /**
     * Open modal with spcified options.
     */
    public openModal(options: ModalData): Observable<SubjectModalData> {
        this.setOpened(true);
        this.modal.title = options.title || null;
        this.modal.body = options.body || null;
        this.modal.decline = options.decline || null;
        this.modal.accept = options.accept || null;
        this.modal.waitToClose = options.waitToClose || false;

        return this.modalSubject.asObservable();
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
        return PluginValidator.validateDisableEnableAction(this.selected, hasToBe, this.openModal.bind(this));
    }

    // Disable all selected plugins
    public onDisable(): void {
        this.errorMessage = null;

        const onDisableSub = this.openModal({
            title: "Disable",
            body: "Are you sure you want to disable the plugins?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        })
        .subscribe((modalSubjectData) => {
            // If user doesn't authorize the action
            if (modalSubjectData.accept === false) {
                this.setOpened(false);
                onDisableSub.unsubscribe();
                return;
            }

            // Close modal
            this.setOpened(false);
            // Clear subscriptions
            onDisableSub.unsubscribe();

            // Validate the action
            this.validateAction(false)
            .then(() => {
                // Show spinner
                this.loading();

                return this.pluginManager
                    // Start the disable process
                    .disablePlugins();
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

    // Enable all selected plugins
    public onEnable(): void {
        this.errorMessage = null;

        const onEnableSub = this.openModal({
            title: "Enable",
            body: "Are you sure you want to enable the plugins?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        })
        .subscribe((modalSubjectData) => {
            // If user doesn't authorize the action
            if (modalSubjectData.accept === false) {
                this.setOpened(false);
                onEnableSub.unsubscribe();
                return;
            }

            // Close modal
            this.setOpened(false);
            // Clear subscriptions
            onEnableSub.unsubscribe();

            // Validate the list of plugins
            this.validateAction(true)
            .then(() => {
                // Show spinner
                this.loading();
                return this.pluginManager
                    // Start enable process
                    .enablePlugins();
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
        onDeleteSub = this.openModal({
            title: "Delete",
            body: "Are you sure you want to delete the plugins?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        })
            .subscribe((modalSubjectData: SubjectModalData) => {
                // If user doesn't authorize the action
                if (modalSubjectData.accept === false) {
                    this.setOpened(false);
                    onDeleteSub.unsubscribe();
                    return;
                }

                this.setOpened(false);
                onDeleteSub.unsubscribe();
                this.loading();

                this.pluginManager
                    // Delete all selected plugins
                    .deletePlugins()
                    .then(() => {
                        // Refresh the list of plugins
                        this.pluginManager.refresh();
                        // Close the loader
                        this.endLoading();
                    })
                    .catch((error) => {
                        this.endLoading();
                        this.openErrorNotifyer = true;
                        this.errorMessage = error.message;
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
     * Open the modal for org scope changing with selected action.
     * @param action action which will be applied ( publish / unpublish )
     */
    public openChangeOrgScope(action: string): void {
        this.changeScopeState = true;
        this.action = action;
    }

    /**
     * Open the modal for scope changing.
     */
    public changeScope() {
        this.openChangeScope = true;
    }

    /**
     * Publish the plugins for all tenants.
     */
    public publishForAllTenants(): void {
        const onPublishForAllSub = this.openModal({
            title: "Publish for all tenants",
            body: "Are you sure you want to publish the plugins for all tenants?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        })
        .subscribe((modalSubjectData) => {
            // If user doesn't authorize the action
            if (modalSubjectData.accept === false) {
                this.setOpened(false);
                onPublishForAllSub.unsubscribe();
                return;
            }

            // Close modal
            this.setOpened(false);

            this.errorMessage = null;
            this.showTracker = true;

            const changeOrgScopeRequestList: Observable<Response>[] = [];

            const subscription = this.pluginManager
                .publishPluginForAllTenants(true)
                .subscribe((res) => {
                    this.changeOrgScopeService.handleCompletedRequest(res);
                }, (error) => {
                    console.error(error);
                    this.endLoading();
                    this.openErrorNotifyer = true;
                    this.errorMessage = error.message;
                    // Notify the service if request complete successfully
                    subscription.unsubscribe();
                    onPublishForAllSub.unsubscribe();
                }, () => {
                    subscription.unsubscribe();
                    onPublishForAllSub.unsubscribe();
                });
            });
    }

    /**
     * Unpublish the plugins for all tenants.
     */
    public unpublishForAllTenants(): void {
        const onUnpublishForAllSub = this.openModal({
            title: "Unpublish for all tenants",
            body: "Are you sure you want to unpublish the plugins for all tenants?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        })
        .subscribe((modalSubjectData) => {
            // If user doesn't authorize the action
            if (modalSubjectData.accept === false) {
                this.setOpened(false);
                onUnpublishForAllSub.unsubscribe();
                return;
            }

            // Close modal
            this.setOpened(false);

            this.errorMessage = null;
            this.showTracker = true;

            const subscription = this.pluginManager
                // Call unpublish all selected plugins
                .unpublishPluginForAllTenants(true)
                .subscribe((res) => {
                    this.changeOrgScopeService.handleCompletedRequest(res);
                }, (error) => {
                    console.error(error);
                    this.endLoading();
                    this.openErrorNotifyer = true;
                    this.errorMessage = error.message;
                    // Notify the service if request complete successfully
                    subscription.unsubscribe();
                    onUnpublishForAllSub.unsubscribe();
                }, () => {
                    subscription.unsubscribe();
                    onUnpublishForAllSub.unsubscribe();
                });
            });
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

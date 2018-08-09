/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";
import { PluginManager } from "../../services/plugin-manager.service";
import { Subscription, Observable, Subject } from "rxjs";
import { ModalData, ModalWindow } from "../../interfaces/Modal";
import { PluginValidator } from "../../classes/plugin-validator";
import { UiPluginMetadataResponse } from "@vcd/bindings/vcloud/rest/openapi/model/uiPluginMetadataResponse";

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
    public modal: ModalData;
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

            this.pluginManager
                .publishPluginForAllTenants(true)
                .forEach((reqData: ChangeScopeRequestTo) => {
                    changeOrgScopeRequestList.push(reqData.req);
                });

                const subscription = Observable.merge(...changeOrgScopeRequestList).subscribe(
                    (res) => {
                        this.changeOrgScopeService.handleCompletedRequest(res);
                    },
                    (error) => {
                        this.endLoading();
                        this.openErrorNotifyer = true;
                        this.errorMessage = error.message;
                        // Notify the service if request complete successfully
                        subscription.unsubscribe();
                        onPublishForAllSub.unsubscribe();
                    },
                    () => {
                        subscription.unsubscribe();
                        onPublishForAllSub.unsubscribe();
                    }
                );
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

            const changeOrgScopeRequestList: Observable<Response>[] = [];

            this.pluginManager
                // Call unpublish all selected plugins
                .unpublishPluginForAllTenants(true)
                // Map the requests to change scope service
                .forEach((reqData: ChangeScopeRequestTo) => {
                    changeOrgScopeRequestList.push(reqData.req);
                });

                const subscription = Observable.merge(...changeOrgScopeRequestList).subscribe(
                    (res) => {
                        this.changeOrgScopeService.handleCompletedRequest(res);
                    },
                    (error) => {
                        this.endLoading();
                        this.openErrorNotifyer = true;
                        this.errorMessage = error.message;
                        // Notify the service if request complete successfully
                        subscription.unsubscribe();
                        onUnpublishForAllSub.unsubscribe();
                    },
                    () => {
                        subscription.unsubscribe();
                        onUnpublishForAllSub.unsubscribe();
                    }
                );
            });
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

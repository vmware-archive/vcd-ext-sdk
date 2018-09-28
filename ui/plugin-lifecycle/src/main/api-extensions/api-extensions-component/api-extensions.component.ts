/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";
import { ApiExtensionService } from "../../services/api-extension.service";
import { Observable, Subscription } from "rxjs";
import { Response } from "@angular/http";
import { ActionVerifierService } from "../../common-vcd/action-verifier.service";
import { QueryResultAdminServiceRecordType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";
import { QueryResultAdminServiceRecords } from "../../interfaces/QueryResultAdminServiceRecords";
import { DatagridPagination } from "clarity-angular";

@Component({
    selector: "vcd-rebranding",
    templateUrl: "./api-extensions.component.html",
    styleUrls: ["./api-extensions.component.scss"]
})
export class ApiExtensionsComponent implements OnInit, OnDestroy {
    // Reference to the pagination datagrid component
    @ViewChild("pagination") pagination: DatagridPagination;

    // Selected AdminExtensionServices
    private _selected: QueryResultAdminServiceRecordType[] = [];

    // Total number of pages with API Extensions
    public total: number;
    // Flag for datagrid build-in loader
    public dgLoading = false;
    // Datagrid page size
    public pageSize = 20;
    // List of AdminExtensionServices
    public api_extensions: QueryResultAdminServiceRecordType[];
    // Toggle loading component
    public isLoading = false;
    // Flag for showing enable button
    public canEnable = false;
    // Flag for showing disable button
    public canDisable = false;
    // Flag for delete button
    public canNotDelete = true;

    // Container for subscriptions
    public subs: Subscription;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private apiExtensionService: ApiExtensionService,
        private actionVerifierService: ActionVerifierService
    ) { }

    // Selected AdminExtensionServices
    get selected() {
        return this._selected;
    }

    // Selected AdminExtensionServices
    set selected(val: QueryResultAdminServiceRecordType[]) {
        this._selected = val;

        this.canNotDelete = false;
        this.canEnable = false;
        this.canDisable = false;

        const enabled = this.selected.find((as) => as.enabled === true);
        const disabled = this.selected.find((as) => as.enabled === false);

        if (enabled) {
            this.canDisable = true;
            this.canNotDelete = true;
        }

        if (disabled) {
            this.canEnable = true;
        }
    }

    public ngOnInit() {}

    public ngOnDestroy() {
        if (this.subs) {
            // Unsubscribe from all observables in this container
            this.subs.unsubscribe();
        }
    }

    /**
     * Request all AdminExtensionServices and asign them.
     */
    public loadApiExtensions(page: number = this.pagination.currentPage): void {
        // Reset selected API Extensions list
        this.selected = [];
        // Turn on loader
        this.isLoading = true;
        // Request all AdminExtensionServices
        const sub = this.apiExtensionService.getApiExtensions(
            page,
            this.pageSize
        ).subscribe((data: QueryResultAdminServiceRecords) => {
            // Assign AdminExtensionServices
            this.api_extensions = data.record;
            // Set new total value
            this.total = data.total;
        }, (err) => {
            // Turn off loader
            this.isLoading = false;
            // Close subscription
            sub.unsubscribe();
            // Log error
            console.error(err);
        }, () => {
            // Turn off loader
            this.isLoading = false;
            // Close subscription
            sub.unsubscribe();
        });
    }

    /**
     * Refresh the list of AdminExtensionServices
     */
    public onRefresh(): void {
        this.loadApiExtensions();
    }

    /**
     * Navigate between API Extensions pages
     */
    public navigate() {
        // Turn on datagrid loader
        this.dgLoading = true;
        const sub = this.apiExtensionService.getApiExtensions(
            this.pagination.currentPage,
            this.pageSize
        ).subscribe((data) => {
            // Assign new total data
            this.total = data.total;
            // Assign new api extensions
            this.api_extensions = data.record;
        }, (err) => {
            // Close subscription
            sub.unsubscribe();
            // Turn off the datagrid loader
            this.dgLoading = false;
            // Log error
            console.error(err);
        }, () => {
            // Close subscription
            sub.unsubscribe();
            // Turn off the datagrid loader
            this.dgLoading = false;
        });
    }

    /**
     * Enable list of AdminExtensionServices
     */
    public onEnable(): void {
        // Open modal
        const modalDataSub = this.actionVerifierService.openModal({
            title: "Enable",
            body: "Are you sure you want to enable the API Extensions?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        }).subscribe((data) => {
            modalDataSub.unsubscribe();

            if (!data.accept) {
                // Return if user decline the action
                // Close modal
                this.actionVerifierService.closeModal();
                return;
            }

            if (this.selected.length === 0) {
                // Return if there is no AdminExtensionServices selected
                // Close modal
                this.actionVerifierService.closeModal();
                return;
            }

            if (this.selected.length === 1 && this.selected[0].enabled === true) {
                // Return if AdminExtensionService is already enabled
                // Close modal
                this.actionVerifierService.closeModal();
                return;
            }

            // Collect all AdminExtensionServices which are ready to enable
            const readyToEnable: QueryResultAdminServiceRecordType[] = [];

            // Loop through the selected AdminExtensionServices
            // and add them in readyToEnable array if they are
            // not already enabled
            this.selected.forEach((sel) => {
                if (sel.enabled === true) {
                    return;
                }

                readyToEnable.push(sel);
            });

            // If all of AdminExtensionServices are enabled the user will
            // be notified with the same modal winodow.
            if (readyToEnable.length === 0) {
                const alertSub = this.actionVerifierService.openModal({
                    title: "Enable",
                    body: "All API Extensions are already enabled.",
                    accept: "Okey",
                    waitToClose: true
                }).subscribe(() => {
                    // Close modal
                    this.actionVerifierService.closeModal();
                    // Close alert modal subscription
                    alertSub.unsubscribe();
                });
                return;
            }

            // If only part of the AdminExtensionServices
            // are enable ready the user will be notified
            // how many of them will NOT be enabled, and
            // will be promped to proceed.
            if (readyToEnable.length !== this.selected.length) {
                const alertSub = this.actionVerifierService.openModal({
                    title: "Enable",
                    body: `${this.selected.length - readyToEnable.length} of ${this.selected.length} are already
                    enabled. Do you want to proceed?`,
                    accept: "Yes",
                    decline: "No",
                    waitToClose: true
                }).subscribe((alertSubData) => {
                    // Close alert modal subscription
                    alertSub.unsubscribe();

                    if (!alertSubData.accept) {
                        // Close modal
                        this.actionVerifierService.closeModal();
                        return;
                    }

                    this.actionVerifierService.closeModal();
                    this.enableReady(readyToEnable);
                });
                return;
            }

            // All selected AdminExtensionServices are
            // enable ready
            this.actionVerifierService.closeModal();
            this.enableReady(readyToEnable);
        });
    }

    /**
     * Disable list of AdminExtensionServices
     */
    public onDisable(): void {
        // Open modal
        const modalDataSub = this.actionVerifierService.openModal({
            title: "Disable",
            body: "Are you sure you want to disable the API Extensions?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        }).subscribe((data) => {
            modalDataSub.unsubscribe();

            if (!data.accept) {
                // Return if user decline the action
                // Close modal
                this.actionVerifierService.closeModal();
                return;
            }

            if (this.selected.length === 0) {
                // Return if there is no AdminExtensionServices selected
                // Close modal
                this.actionVerifierService.closeModal();
                return;
            }

            if (this.selected.length === 1 && this.selected[0].enabled === false) {
                // Return if AdminExtensionService is already disable
                console.log("ALREADY DISABLED!");
                // Close modal
                this.actionVerifierService.closeModal();
                return;
            }

            // Collect all AdminExtensionServices which are ready to disable
            const readyToDisable: QueryResultAdminServiceRecordType[] = [];

            // Loop through the selected AdminExtensionServices
            // and add them in readyToDisable array if they are
            // not already disabled
            this.selected.forEach((sel) => {
                if (sel.enabled === false) {
                    return;
                }

                readyToDisable.push(sel);
            });

            // If all of AdminExtensionServices are disabled the user will
            // be notified with the same modal winodow.
            if (readyToDisable.length === 0) {
                const alertSub = this.actionVerifierService.openModal({
                    title: "Disable",
                    body: "All API Extensions are already disabled.",
                    accept: "Okey",
                    waitToClose: true
                }).subscribe(() => {
                    // Refresh the list of API Extensions
                    this.actionVerifierService.closeModal();
                    // Close alert modal subscription
                    alertSub.unsubscribe();
                });
                return;
            }

            // If only part of the AdminExtensionServices
            // are disabled ready the user will be notified
            // how many of them will NOT be disabled, and
            // will be promped to proceed.
            if (readyToDisable.length !== this.selected.length) {
                const alertSub = this.actionVerifierService.openModal({
                    title: "Disable",
                    body: `${this.selected.length - readyToDisable.length} of ${this.selected.length} are already
                    disabled. Do you want to proceed?`,
                    accept: "Yes",
                    decline: "No",
                    waitToClose: true
                }).subscribe((alertSubData) => {
                    // Close alert modal subscription
                    alertSub.unsubscribe();

                    if (!alertSubData.accept) {
                        // Close modal window
                        this.actionVerifierService.closeModal();
                        return;
                    }

                    this.actionVerifierService.closeModal();
                    this.disableReady(readyToDisable);
                });
                return;
            }

            // All selected AdminExtensionServices are
            // disable ready
            this.actionVerifierService.closeModal();
            this.disableReady(readyToDisable);
        });
    }

    /**
     * Delete list of AdminExtensionServices
     */
    public onDelete(): void {
        // Open modal and wait the user to proceed
        const modalDataSub = this.actionVerifierService.openModal({
            title: "Delete",
            body: "Are you sure you want to delete these API Extensions?",
            decline: "No",
            accept: "Yes",
            waitToClose: true
        }).subscribe((data) => {
            // Close modal subscription
            modalDataSub.unsubscribe();

            // Return and close if user decline the operation
            if (!data.accept) {
                // Close modal window
                this.actionVerifierService.closeModal();
                return;
            }

            // Close modal
            this.actionVerifierService.closeModal();
            // Turn on loader
            this.isLoading = true;
            // Start delete process
            const subs = this.delete(this.selected).subscribe(() => {
                // Turn off loader
                this.isLoading = false;
            }, (err) => {
                subs.unsubscribe();
                console.error(err);
            }, () => {
                if (this.selected.length === this.api_extensions.length) {
                    this.pagination.previous();
                    return;
                }

                // Refresh the list of API Extensions
                this.loadApiExtensions(
                    (this.selected.length === this.api_extensions.length) &&
                    (this.pagination.currentPage === this.pagination.lastPage) ?
                    this.pagination.currentPage - 1 :
                    this.pagination.currentPage
                );
            });
        });
    }

    /**
     * Enable list of admin service records
     * and indicate that the operation is triggered.
     * @param readyToEnable list of admin service records
     */
    public enableReady(readyToEnable: QueryResultAdminServiceRecordType[]): void {
        this.isLoading = true;
        const subs = this.enable(readyToEnable).subscribe(() => { }, (err) => {
            console.error(err);
            // Turn off loader
            this.isLoading = false;
            // Close disable subscriptions
            subs.unsubscribe();
        }, () => {
            // Turn off loader
            this.isLoading = false;
            // Refresh the list of API Extensions
            this.loadApiExtensions();
            // Close disable subscriptions
            subs.unsubscribe();
        });
    }

    /**
     * Disable list of admin service records
     * and indicate that the operation is triggered.
     * @param readyToDisable list of admin service records
     */
    public disableReady(readyToDisable: QueryResultAdminServiceRecordType[]): void {
        this.isLoading = true;
        const subs = this.disable(readyToDisable).subscribe(() => { }, (err) => {
            console.error(err);
            // Turn off loader
            this.isLoading = false;
            // Close disable subscriptions
            subs.unsubscribe();
        }, () => {
            // Turn off loader
            this.isLoading = false;
            // Refresh the list of API Extensions
            this.loadApiExtensions();
            // Close disable subscriptions
            subs.unsubscribe();
        });
    }

    /**
     * Loop through the list collection and request enabling, after
     * the whole list is traversed the requests will be
     * executed in parallel with merge operator.
     * @param readyTo list of AdminExtensionServices
     */
    public enable(readyTo: QueryResultAdminServiceRecordType[]): Observable<Response[]> {
        const proc: Observable<Response>[] = [];

        readyTo.forEach((ext) => {
            proc.push(
                this.apiExtensionService.enable(ext.href)
            );
        });

        return Observable.forkJoin(...proc);
    }

    /**
     * Loop through the list collection and request disabling, after
     * the whole list is traversed the requests will be
     * executed in parallel with merge operator.
     * @param readyTo list of AdminExtensionServices
     */
    public disable(readyTo: QueryResultAdminServiceRecordType[]): Observable<Response[]> {
        const proc: Observable<Response>[] = [];

        readyTo.forEach((ext) => {
            proc.push(
                this.apiExtensionService.disable(ext.href)
            );
        });

        return Observable.forkJoin(...proc);
    }

    /**
     * Loop through the list collection and request delete operation, after
     * the whole list is traversed the requests will be
     * executed in parallel with merge operator.
     * @param exts list of AdminExtensionServices
     */
    public delete(exts: QueryResultAdminServiceRecordType[]): Observable<Response[]> {
        const proc: Observable<Response>[] = [];

        exts.forEach((ext) => {
            proc.push(
                this.apiExtensionService.delete(ext.href)
            );
        });

        return Observable.forkJoin(...proc);
    }
}

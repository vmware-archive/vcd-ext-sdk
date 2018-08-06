/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, EventEmitter, Output, ViewChild } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";
import { PluginManager } from "../../services/plugin-manager.service";
import { UploadPayload } from "../../interfaces/Plugin";
import { ZipManager } from "../../services/zip-manager.service";
import { Wizard } from "clarity-angular";
import { PluginValidator } from "../../classes/plugin-validator";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { Subscription, Observable } from "rxjs";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";
import { TenantService } from "../../services/tenant.service";
import { QueryResultOrgRecordType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

interface InputNativeElement {
    nativeElement: HTMLInputElement;
}

@Component({
    selector: "vcd-plugin-upload",
    templateUrl: "./upload-component.html",
    styleUrls: ["upload-component.scss"]
})
export class UploadComponent implements OnInit {
    // Toggle the uploading modal
    private _open: boolean;

    // Set the open value
    @Input()
    set open(val: boolean) {
        this._open = val;

        if (val === false) {
            if (this.watchOrgsSubs) {
                this.watchOrgsSubs.unsubscribe();
            }

            if (this.uploadSubs) {
                this.uploadSubs.unsubscribe();
            }
        }
    }
    // Emits the change of the open flag to all listeners
    @Output() openChange = new EventEmitter<boolean>();
    // Gets the wizard html element
    @ViewChild("wizardlg") wizardLarge: Wizard;
    // Track the user selection
    public scopeFeedback: ScopeFeedback = new ScopeFeedback();
    // The data which is extacted from the uploaded file and the actual file
    public uploadPayload: UploadPayload;
    // Show spinner while uploading
    public loading = false;
    // Show / hide next button in the wizard
    public canGoNext = false;
    // Show / hide spinner while parsing the manifest file
    public parsing = false;
    // Shows on the sceen when any warning appear
    public alertMessage: string;
    public listOfOrgsPerPlugin: ChangeScopeItem[];
    public orgs: QueryResultOrgRecordType[];
    // Summary to describe what will be applied on upload
    public summary: string;

    public watchOrgsSubs: Subscription;
    public uploadSubs: Subscription;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        public pluginManager: PluginManager,
        public zipManager: ZipManager,
        public orgService: TenantService
    ) { }

    public ngOnInit() {
        this.uploadPayload = {
            manifest: null,
            fileName: null,
            fileDir: null,
            file: null
        };
    }

    /**
     * Get open value.
     */
    get open(): boolean {
        return this._open;
    }

    /**
     * Triggered when some file is selected via the file input.
     * @param pluginZip the input field which contains the fiel which will be uploaded
     */
    public onFileSelection(pluginZip: InputNativeElement) {
        if (!pluginZip.nativeElement) {
            return;
        }

        this.uploadPayload.fileName = pluginZip.nativeElement.files[0].name;
        this.uploadPayload.file = pluginZip.nativeElement.files[0];

        // Process the zip file
        this.processZip();
    }

    /**
     * Parsing the zip file
     */
    public processZip(): void {
        // Show spinner while parsing the zip
        this.parsing = true;
        this.zipManager
            // Parse the zip file
            .parse(this.uploadPayload.file)
            .then((manifest: string) => {
                // Parse the manifest
                this.uploadPayload.manifest = JSON.parse(manifest);
                // Set inital values for the scope from the manifest
                this.scopeFeedback.scope = this.uploadPayload.manifest.scope;

                // Validate the manifest
                const isValidManifest = PluginValidator.validateManifestFields(this.uploadPayload.manifest);
                if (!isValidManifest.success) {
                    const reason = isValidManifest.errors[Object.keys(isValidManifest.errors)[0]];
                    throw new Error(`${isValidManifest.message} ${reason}`);
                }

                // Check for plugin duplicatons
                return this.pluginManager.checkForDuplications(this.uploadPayload.manifest);
            })
            .then((duplication) => {
                if (duplication) {
                    throw new Error("This plugin already exists, please ensure your plugin name, vendor, version is unique.");
                }
                this.alertMessage = null;
                this.canGoNext = true;
                this.parsing = false;

                // Load the list of plugins and organistaions
                this.loadListOfOrgsPerPlugin();
            })
            .catch((err: Error) => {
                console.warn(err);
                this.alertMessage = err.message;
                this.canGoNext = false;
                this.parsing = false;
            });
    }

    /**
     * Trigger upload process
     */
    public doUpload(): void {
        // Show spinner
        this.loading = true;

        if (this.scopeFeedback.scope !== this.uploadPayload.manifest.scope) {
            this.uploadPayload.manifest.scope = this.scopeFeedback.scope;
        }

        this.uploadSubs = this.pluginManager
            // Start upload process
            .uploadPlugin(this.uploadPayload, this.scopeFeedback)
            .subscribe((data) => {
                if (!data) {
                    this.handleUploadSuccess();
                    this.uploadSubs.unsubscribe();
                    return;
                }

                const subs = data.subscribe((res) => {
                    // Handle successfull upload
                }, (error) => {
                    console.error(error);
                    subs.unsubscribe();
                    this.uploadSubs.unsubscribe();
                }, () => {
                    this.handleUploadSuccess();
                    subs.unsubscribe();
                    this.uploadSubs.unsubscribe();
                });

            }, this.handleUploadError, () => {
                this.handleUploadSuccess();
                this.uploadSubs.unsubscribe();
            });
    }

    /**
     * Execute on successfull plugin upload
     */
    public handleUploadSuccess(): void {
        // Hide spinner
        this.loading = false;
        // Remove file loaded in the payload
        this.uploadPayload.file = null;
        // Remove file name loaded in the payload
        this.uploadPayload.fileName = null;
        // Remove file dir loaded in the payload
        this.uploadPayload.fileDir = null;
        // Remove file manifest loaded in the payload
        this.uploadPayload.manifest = null;
        // Refresh the plugins list
        this.pluginManager.refresh();
        // Close the modal
        this.onCancel();
        // Reset the wizard
        this.wizardLarge.reset();
        // Reset the select scope data
        this.scopeFeedback.reset();
        // Disable next button into the wizard
        this.canGoNext = false;
    }

    /**
     * Handle provided error.
     * @param err error
     */
    public handleUploadError(err: Error): void {
        this.loading = false;
        this.alertMessage = err.message;
    }

    /**
     * Close upload modal.
     */
    public onCancel(): void {
        this.open = false;
        this.openChange.emit(this.open);
    }

    /**
     * Create custom actions for the buttons in the wizard.
     * @param buttonType type of the button clicked
     */
    public doCustomClick(buttonType: string): void {
        if ("custom-finish" === buttonType) {
            // Start upload process
            this.doUpload();
            return;
        }

        if ("custom-cancel" === buttonType) {
            // Cancel the modal
            this.onCancel();
            return;
        }

        if ("custom-next" === buttonType && this.canGoNext) {
            // Go to the next page
            this.wizardLarge.next();

            if (this.wizardLarge.isLast) {
                this.summary = `Upload plugin which is scoped for ${this.scopeFeedback.scope.toString()} and published for
                ${this.scopeFeedback.publishForAllTenants ?
                    "all tenants." : this.scopeFeedback.data.length > 0 ?
                        this.scopeFeedback.data.length + " tenants." : "no one tenant."}`;
            }
        }
    }

    /**
     * Load the list of tenants.
     */
    public loadListOfOrgsPerPlugin(): void {
        this.loadOrgs();
        this.populateList();
    }

    /**
     * Load all tenants.
     */
    public loadOrgs(): void {
        this.watchOrgsSubs = this.orgService.watchOrgs().subscribe((orgs) => {
                this.orgs = orgs;
                this.populateList();
            }, (error) => {
                console.error(error);
            }, () => {
                // Handle complete
            });
    }

    /**
     * Populate the list of tenants.
     */
    public populateList(): void {
        this.listOfOrgsPerPlugin = [];
        this.orgs.forEach((org: QueryResultOrgRecordType) => {
            this.listOfOrgsPerPlugin.push({
                orgName: org.name,
                plugin: {
                    pluginName: this.uploadPayload.manifest.name,
                    vendor: this.uploadPayload.manifest.vendor,
                    version: this.uploadPayload.manifest.version,
                    license: this.uploadPayload.manifest.license,
                    link: this.uploadPayload.manifest.link
                },
                action: "publish"
            });
        });
    }
}

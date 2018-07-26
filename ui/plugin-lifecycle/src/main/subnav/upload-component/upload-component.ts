/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { PluginManager } from "../../services/plugin-manager.service";
import { UploadPayload } from "../../interfaces/Plugin";
import { ZipManager } from "../../services/zip-manager.service";
import { Wizard } from "clarity-angular";
import { PluginValidator } from "../../classes/plugin-validator";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { Subscription } from "rxjs";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";
import { Organisation } from "../../interfaces/Organisation";
import { OrganisationService } from "../../services/organisation.service";

interface InputNativeElement {
    nativeElement: HTMLInputElement;
}

@Component({
    selector: "vcd-plugin-upload",
    templateUrl: "./upload-component.html",
    styleUrls: ["upload-component.scss"]
})
export class UploadComponent implements OnInit {
    private _open: boolean;

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
    @Output() openChange = new EventEmitter<boolean>();
    @ViewChild("wizardlg") wizardLarge: Wizard;
    public scopeFeedback: ScopeFeedback = new ScopeFeedback();
    public uploadPayload: UploadPayload;
    public loading: boolean = false;
    public canGoNext: boolean = false;
    public parsing: boolean = false;
    public alertMessage: string;
    public listOfOrgsPerPlugin: ChangeScopeItem[];
    public orgs: Organisation[];

    public watchOrgsSubs: Subscription;
    public uploadSubs: Subscription;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        public pluginManager: PluginManager,
        public zipManager: ZipManager,
        public orgService: OrganisationService
    ) { }

    public ngOnInit() {
        this.uploadPayload = {
            manifest: null,
            fileName: null,
            fileDir: null,
            file: null
        };
    }

    get open(): boolean {
        return this._open;
    }

    public onFileSelection(pluginZip: InputNativeElement) {
        if (!pluginZip.nativeElement) {
            return;
        }

        this.uploadPayload.fileName = pluginZip.nativeElement.files[0].name;
        this.uploadPayload.file = pluginZip.nativeElement.files[0];

        this.proccessZip();
    }

    public proccessZip(): void {
        this.parsing = true;
        this.zipManager
            .parse(this.uploadPayload.file)
            .then((manifest: string) => {
                this.uploadPayload.manifest = JSON.parse(manifest);

                const isValidManifest = PluginValidator.validateManifestFields(this.uploadPayload.manifest);
                if (!isValidManifest.success) {
                    const reason = isValidManifest.errors[Object.keys(isValidManifest.errors)[0]];
                    throw new Error(`${isValidManifest.message} ${reason}`);
                }

                return this.pluginManager.checkForDuplications(this.uploadPayload.manifest.name);
            })
            .then((duplication) => {
                if (duplication) {
                    throw new Error('Plugin with this name already exists, please ensure your plugin name is unique.')
                }
                this.alertMessage = null;
                this.canGoNext = true;
                this.parsing = false;

                this.loadListOfOrgsPerPlugin();
            })
            .catch((err: Error) => {
                console.warn(err);
                this.alertMessage = err.message;
                this.canGoNext = false;
                this.parsing = false;
            });
    }

    public doUpload(): void {
        this.loading = true;
        this.uploadSubs = this.pluginManager
            .uploadPlugin(this.uploadPayload, this.scopeFeedback)
            .subscribe((changeScopeRequests) => {
                if (!changeScopeRequests || changeScopeRequests.length < 1) {
                    this.handleUploadSuccess();
                    this.uploadSubs.unsubscribe();
                    return;
                }

                changeScopeRequests.forEach((element) => {
                    const subscription = element.req.subscribe((res) => {
                        this.handleUploadSuccess();
                        subscription.unsubscribe();
                    }, this.handleUploadError);
                });
            }, this.handleUploadError);
    }

    public handleUploadSuccess(): void {
        this.loading = false;
        this.uploadPayload.file = null;
        this.uploadPayload.fileName = null;
        this.uploadPayload.fileDir = null;
        this.uploadPayload.manifest = null;
        this.pluginManager.refresh();
        this.onCancel();
        this.wizardLarge.reset();
        this.scopeFeedback.reset();
        this.canGoNext = false;
    }

    public handleUploadError(err: Error): void {
        console.warn(err);
        this.alertMessage = err.message;
        this.loading = false;
    }

    public onCancel(): void {
        this.open = false;
        this.openChange.emit(this.open);
    }

    public doCustomClick(buttonType: string): void {
        if ("custom-finish" === buttonType) {
            this.doUpload();
            return;
        }

        if ("custom-cancel" === buttonType) {
            this.onCancel();
            return;
        }

        if ("custom-next" === buttonType && this.canGoNext) {
            this.wizardLarge.next();
        }
    }

    public loadListOfOrgsPerPlugin(): void {
        this.loadOrgs();
        this.populateList();
    }

    public loadOrgs(): void {
        this.orgs = this.orgService.orgs;
        this.watchOrgsSubs = this.orgService.watchOrgs().subscribe(
            (orgs) => {
                this.orgs = orgs;
                this.populateList();
            }
        )
    }

    public populateList(): void {
        this.listOfOrgsPerPlugin = [];
        this.orgs.forEach((org: Organisation) => {
            this.listOfOrgsPerPlugin.push({ orgName: org.name, plugin: this.uploadPayload.manifest.name, action: 'publish' });
        });
    }
}

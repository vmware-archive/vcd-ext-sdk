/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, EventEmitter, Output, ViewChild } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { PluginManager } from "../../services/plugin-manager.service";
import { UploadPayload } from "../../interfaces/Plugin";
import { ZipManager } from "../../services/zip-manager.service";
import { Wizard } from "clarity-angular";
import { PluginValidator } from "../../classes/plugin-validator";

interface InputNativeElement {
    nativeElement: HTMLInputElement;
}

@Component({
    selector: "vcd-plugin-upload",
    templateUrl: "./upload-component.html",
    styleUrls: ["upload-component.scss"]
})
export class UploadComponent implements OnInit {
    @Input() wantToUpload: boolean = false;
    @Output() change = new EventEmitter<boolean>();
    @ViewChild("wizardlg") wizardLarge: Wizard;
    public uploadPayload: UploadPayload;
    public loading: boolean = false;
    public canGoNext: boolean = false;
    public canUpload: boolean = false;
    public parsing: boolean = false;
    public alertMessage: string;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        public pluginManager: PluginManager,
        public zipManager: ZipManager
    ) { }

    public ngOnInit() {
        this.uploadPayload = {
            manifest: null,
            fileName: null,
            fileDir: null,
            file: null
        };
    }

    public onChange(pluginZip: InputNativeElement) {
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
            })
            .catch((err: Error) => {
                console.warn(err);
                this.alertMessage = err.message;
                this.canGoNext = false;
                this.parsing = false;
            });
    }

    public setWantToUpload(val: boolean): void {
        this.wantToUpload = val;
        this.change.emit(val);
    }

    public getWantToUpload(): boolean {
        return this.wantToUpload;
    }

    public doUpload(): void {
        console.log('DO UPLOAD');
        if (!this.canUpload) {
            return;
        }

        this.loading = true;
        this.pluginManager
            .uploadPlugin(this.uploadPayload)
            .then(() => {
                this.loading = false;
                this.uploadPayload.file = null;
                this.uploadPayload.fileName = null;
                this.uploadPayload.fileDir = null;
                this.uploadPayload.manifest = null;
                this.pluginManager.refresh();
                this.setWantToUpload(false);
                this.canUpload = false;
                this.wizardLarge.reset();
            })
            .catch((err) => {
                // Handle error
                console.warn(err);
                this.alertMessage = err.message;
                this.loading = false;
            });
    }

    public onCancel(): void {
        this.setWantToUpload(false);
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
            this.canGoNext = false;
        }
    }
}

/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Output, EventEmitter, ViewChild } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";

interface InputNativeElement {
    nativeElement: HTMLInputElement;
}

@Component({
    selector: "vcd-upload-zip-field",
    templateUrl: "./upload-zip-field.component.html",
    styleUrls: ["upload-zip-field.component.scss"]
})
export class UploadZipField implements OnInit {
    @Output() change = new EventEmitter<InputNativeElement>();
    @ViewChild("pluginZip") pluginZip: InputNativeElement;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) { }

    ngOnInit() {}

    public onChange(): void {
        if (!this.pluginZip.nativeElement.files[0]) {
            return;
        }

        this.change.emit(this.pluginZip);
    }
}

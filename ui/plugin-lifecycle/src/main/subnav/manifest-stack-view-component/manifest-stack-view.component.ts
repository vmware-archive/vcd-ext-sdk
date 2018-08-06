/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, Input } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";

@Component({
    selector: "vcd-manifest-stack-view",
    templateUrl: "./manifest-stack-view.component.html",
    styleUrls: [
        "./manifest-stack-view.component.scss"
    ]
})
export class VcdManifestStackView {
    // Show / hide spinner while parsing
    @Input() parsing: boolean;
    // The data which is got from the parsed manifest
    @Input() uploadPayload: any;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) { }
}
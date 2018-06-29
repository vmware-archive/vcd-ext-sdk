/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";

@Component({
    selector: "vcd-alert",
    templateUrl: "./alert.component.html"
})
export class VcdAlert implements OnInit {
    @Input() alertMessage: string;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) { }

    ngOnInit() {}

    public setAlertMessage(message: string): void {
        this.alertMessage = message;
    }

    public getAlertMessage(): string {
        return this.alertMessage;
    }
}
/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";

@Component({
    selector: "vcd-alert",
    templateUrl: "./alert.component.html"
})
export class VcdAlert implements OnInit {
    private _alertClasses = "alert-danger";
    @Input() alertMessage: string;
    @Input()
    set alertClasses(val: string) {
        this._alertClasses = val;
    }

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) { }

    ngOnInit() {}

    get alertClasses(): string {
        return this._alertClasses;
    }

    public setAlertMessage(message: string): void {
        this.alertMessage = message;
    }

    public getAlertMessage(): string {
        return this.alertMessage;
    }
}

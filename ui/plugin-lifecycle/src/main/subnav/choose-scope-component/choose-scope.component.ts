/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html"
})
export class ChooseScope implements OnInit {
    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}
}
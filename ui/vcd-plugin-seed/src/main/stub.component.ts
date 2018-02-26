/*
 * Copyright 2017 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, Inject} from "@angular/core";
import {EXTENSION_ASSET_URL} from '@vcd-ui/common';

@Component({
    selector: "vcd-stub",
    templateUrl: "./stub.component.html",
    styleUrls: ['./stub.component.scss']
})
export class StubComponent {
    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string) {}
}

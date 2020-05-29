/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, Inject} from "@angular/core";
import {EXTENSION_ASSET_URL} from '@vcd/sdk/common';

@Component({
    selector: "vcd-plugin-about",
    template: `
        <div>
            <p>{{"subnav.about.content.1" | translate}}</p>
            <p>{{"subnav.about.content.2" | translate}}</p>
        </div>

    `
})
export class AboutComponent {
    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string) {}
}

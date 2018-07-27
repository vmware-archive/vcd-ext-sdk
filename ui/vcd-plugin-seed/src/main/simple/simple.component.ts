import { Component, Inject, OnInit } from "@angular/core";
import { VcdApiClient } from '@vcd/sdk';
import { EXTENSION_ASSET_URL } from '@vcd/sdk/common';

@Component({
    selector: "plugin-simple",
    templateUrl: "./simple.component.html",
    styleUrls: ['./simple.component.scss'],
    host: {'class': 'content-container'}
})
export class SimpleComponent implements OnInit {
    username: string = 'unknown';
    tenant: string = 'unknown'

    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string, private client: VcdApiClient) {}

    ngOnInit(): void {
        this.tenant = this.client.organization;
        this.username = this.client.username;
    }
}

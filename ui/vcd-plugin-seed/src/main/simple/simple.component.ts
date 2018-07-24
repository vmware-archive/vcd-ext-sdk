import { Component, Inject, OnInit } from "@angular/core";
import { EXTENSION_ASSET_URL, VcdApiClient } from '@vcd/sdk';

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

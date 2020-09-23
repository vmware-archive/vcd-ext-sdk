import { Component, Inject, OnInit } from "@angular/core";
import { VcdApiClient } from '@vcd/sdk';
import { EXTENSION_ASSET_URL } from '@vcd/sdk/common';
import { Query } from "@vcd/sdk/query";
import { Observable } from "rxjs";

@Component({
    selector: "plugin-simple",
    templateUrl: "./simple.component.html",
    host: {'class': 'content-container'}
})
export class SimpleComponent implements OnInit {
    username: Observable<string>;
    tenant: Observable<string>;

    constructor(@Inject(EXTENSION_ASSET_URL) public assetUrl: string, private client: VcdApiClient) {}

    ngOnInit(): void {
        this.tenant = this.client.organization;
        this.username = this.client.username
        
        this.client.query(Query.Builder.ofType("organization").links(false)).subscribe(results => {
            console.log(results);
        })
    }
}

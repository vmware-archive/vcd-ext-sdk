import { Component, Inject, OnInit } from "@angular/core";
import { VcdApiClient } from '@vcd/sdk';
import { EXTENSION_ASSET_URL } from '@vcd/sdk/common';
import { Query } from "@vcd/sdk";
import { Observable } from "rxjs";

@Component({
    selector: "<%- name %>-plugin",
    templateUrl: "./<%- name %>.component.html",
    styleUrls: ['./<%- name %>.component.scss'],
    host: {'class': 'content-container'}
})
export class <%- nameCamelCase %>Component implements OnInit {
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

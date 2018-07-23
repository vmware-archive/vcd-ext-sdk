/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit } from "@angular/core";
import { OrganisationService } from "../../services/organisation.service";
import { PluginManager } from "../../services/plugin-manager.service";

@Component({
    selector: "vcd-change-scope-tracker",
    templateUrl: "./change-scope-tracker.component.html"
})
export class ChangeScopeTracker implements OnInit {
    public requests: any[];
    constructor(
        private pluginService: PluginManager
    ) { }

    ngOnInit() {
        this.loadRequests();
    }

    public loadRequests(): void {
        this.pluginService
            .watchChangeScopeReq()
            .subscribe(
                (data) => {
                    console.log(data);
                    this.requests = data;
                }
            )
    }
}
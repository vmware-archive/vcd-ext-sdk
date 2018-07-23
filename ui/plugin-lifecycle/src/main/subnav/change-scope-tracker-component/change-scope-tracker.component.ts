/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit } from "@angular/core";
import { OrganisationService } from "../../services/organisation.service";
import { PluginManager } from "../../services/plugin-manager.service";

interface ScopeChangeRequest {
    plugin: string;
    org: string;
}

@Component({
    selector: "vcd-change-scope-tracker",
    templateUrl: "./change-scope-tracker.component.html"
})
export class ChangeScopeTracker implements OnInit {
    public requests: ScopeChangeRequest[];
    constructor(
        private orgService: OrganisationService,
        private pluginService: PluginManager
    ) { }

    ngOnInit() {
        this.loadRequests();
    }

    public loadRequests(): void {
        this.requests = [
            { 
                plugin: 'Plugin-1',
                org: 'Org-1'
            },
            { 
                plugin: 'Plugin-2',
                org: 'Org-2'
            },
            { 
                plugin: 'Plugin-2',
                org: 'Org-3'
            },
            { 
                plugin: 'Plugin-4',
                org: 'Org-4'
            }
        ];
    }
}
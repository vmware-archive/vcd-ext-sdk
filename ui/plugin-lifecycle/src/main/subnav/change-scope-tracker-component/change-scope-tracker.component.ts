/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { PluginManager } from "../../services/plugin-manager.service";
import { Subscription } from "rxjs";
import { ChangeScopeRequest } from "../../classes/ChangeScopeRequest";
import { ChangeScopeService } from "../../services/change-scope.service";

@Component({
    selector: "vcd-change-scope-tracker",
    templateUrl: "./change-scope-tracker.component.html"
})
export class ChangeScopeTracker implements OnInit, OnDestroy {
    public requests: ChangeScopeRequest[];
    public watchChangeScopeReq: Subscription;

    constructor(
        private changeScopeService: ChangeScopeService
    ) { }

    ngOnInit() {
        this.loadRequests();
    }

    ngOnDestroy() {
        this.watchChangeScopeReq.unsubscribe();
    }

    public loadRequests(): void {
        this.watchChangeScopeReq = this.changeScopeService.watchChangeScopeReq().subscribe((data) => {
            this.requests = data;
        })
    }
}
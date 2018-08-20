/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ChangeScopeRequest } from "../../classes/ChangeScopeRequest";

@Component({
    selector: "vcd-change-tenant-scope-tracker",
    templateUrl: "./change-tenant-scope-tracker.component.html"
})
export class ChangeTenantScopeTracker implements OnInit, OnDestroy {
    private _open: boolean;

    @Input()
    set open(val: boolean) {
        if (val === false) {
            if (this.watchChangeScopeReq) {
                this.watchChangeScopeReq.unsubscribe();
            }
        }

        this._open = val;
    }
    @Output() openChange = new EventEmitter<boolean>();
    public requests: ChangeScopeRequest[];
    public watchChangeScopeReq: Subscription;

    constructor() { }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.watchChangeScopeReq) {
            this.watchChangeScopeReq.unsubscribe();
        }
    }

    get open(): boolean {
        return this._open;
    }

    /**
     * Close the chage org request tracker modal.
     */
    public onClose(): void {
        this.open = false;
        this.openChange.emit(false);
    }
}

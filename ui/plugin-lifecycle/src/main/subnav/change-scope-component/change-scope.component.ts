/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { ChangeScopeService } from "../../services/change-scope.service";
import { PluginManager } from "../../services/plugin-manager.service";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html"
})
export class ChangeScope implements OnInit {
    public feedback = new ScopeFeedback();
    private _enableForProviders: boolean;
    private _enableForTenants: boolean;
    private _open: boolean = false;

    @Input() 
    set open(val: boolean) {
        this._open = val;
    }
    @Output() openChange = new EventEmitter<boolean>();

    constructor(
        private changeScopeService: ChangeScopeService,
        private pluginManager: PluginManager
    ) { }

    ngOnInit() {}

    get open(): boolean {
        return this._open;
    }

    get enableForProviders(): boolean {
        return this._enableForProviders;
    }

    set enableForProviders(val: boolean) {
        this._enableForProviders = val;

        if (this.enableForProviders) {
            this.feedback.addNewScope('service-provider');
        } else {
            this.feedback.removeScope('service-provider');
        }
    }

    get enableForTenants(): boolean {
        return this._enableForTenants;
    }

    set enableForTenants(val: boolean) {
        this._enableForTenants = val;

        if (this.enableForTenants) {
            this.feedback.addNewScope('tenant');
        } else {
            this.feedback.removeScope('tenant');
        }
    }

    public changeScope(): void {
        const subs = this.changeScopeService.changeScope(this.pluginManager.selectedPlugins, this.feedback.scope, this.pluginManager.baseUrl)
            .subscribe((res) => {
                console.log(res);
            }, (err) => {
                // Handle err
                console.warn(err);
            }, () => {
                console.log("Scope changing complete...");
                subs.unsubscribe();
            });
    }

    public onClose(): void {
        this.open = false;
        this.openChange.emit(false);
    }
}
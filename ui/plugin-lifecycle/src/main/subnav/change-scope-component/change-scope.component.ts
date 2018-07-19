/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ChangeScopeFeedback } from "../../classes/ChangeScopeFeedback";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html"
})
export class ChangeScope implements OnInit {
    private _state: boolean;
    public feedback: ChangeScopeFeedback = new ChangeScopeFeedback();
    @Input()
    set state (val: boolean) {
        this._state = val;
    }
    @Output() public changeState = new EventEmitter<boolean>();
    @Output() public changeScope = new EventEmitter<ChangeScopeFeedback>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}

    get state (): boolean {
        return this._state;
    }

    public changeScope(): void {
        this.alertMessage = null;
        // Validate change scope action
        const pluginsToBeUpdated: Plugin[] = [];
        this.pluginManager.selectedPlugins.forEach((selectedPlugin: Plugin) => {
            // Already in state
            if (
                (selectedPlugin.tenant_scoped === (this.feedback.scope.indexOf("tenant") !== -1)) &&
                (selectedPlugin.provider_scoped === (this.feedback.scope.indexOf("service-provider") !== -1))
            ) {
                return;
            }
    
            pluginsToBeUpdated.push(selectedPlugin);
        });

        if (pluginsToBeUpdated.length < 1) {
            this.alertMessage = "All plugins are in this state already!";
            return;
        }

        if (pluginsToBeUpdated.length !== this.pluginManager.selectedPlugins.length) {
            this.alertMessage = `Only ${pluginsToBeUpdated.length} plugins will be scope changed, others are already in this state.`;
        }

        this.loading = true;
        const subs = this.changeScopeService.changeScope(this.pluginManager.selectedPlugins, this.feedback.scope, this.pluginManager.baseUrl)
            .subscribe((res) => {
                this.hasToRefresh = true;
                console.log(res);
            }, (err) => {
                // Handle error
                console.warn(err);
            }, () => {
                this.loading = false;
                subs.unsubscribe();
            });
    }

    public onClose(): void {
        this.open = false;
        this.alertMessage = null;
        this.feedback.reset();
        this.openChange.emit(false);

        if (this.hasToRefresh) {
            this.hasToRefresh = false;
            this.pluginManager.refresh();
        }
    }
}
/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { PluginManager } from "../../services/plugin-manager.service";
import { ChangeScopeService } from "../../services/change-scope.service";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html",
    styleUrls: ["./change-scope.component.scss"]
})
export class ChangeScope implements OnInit {
    private _state: boolean = false;
    public feedback: ScopeFeedback = new ScopeFeedback();
    @Input()
    set state (val: boolean) {
        if (val === false) {
            this.feedback.reset();
        }

        this._state = val;
    }
    @Output() public stateChange = new EventEmitter<boolean>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private pluginManager: PluginManager,
        private changeScopeService: ChangeScopeService
    ) {}

    ngOnInit() {}

    get state (): boolean {
        return this._state;
    }

    public publishForAllTenants(): void {
        this.pluginManager
            .publishPluginForAllTenants(null)
            .then(() => {
                return this.pluginManager.refresh();
            })
            .then(() => {
                this.onClose();
            })
            .catch((err) => {
                // Handle Error
                console.warn(err);
            })
    }

    public unpublishForAllTenants(): void {
        this.pluginManager
            .unpublishPluginForAllTenants(null)
            .then(() => {
                return this.pluginManager.refresh();
            })
            .then(() => {
                this.onClose();
            })
            .catch((err) => {
                // Handle Error
                console.warn(err);
            })
    }

    public handleMixedScope(feedback: ScopeFeedback): void {
        const requests = this.pluginManager.handleMixedScope(feedback, true);

        requests.forEach((element) => {
            const subs = element.req.subscribe(
                (res) => {
                    this.changeScopeService.changeReqStatusTo(res.url, true);
                    subs.unsubscribe();
                },
                (err) => {
                    // Handle Error
                    this.changeScopeService.changeReqStatusTo(element.url, false);
                    console.warn(err);
                }
            )
        });
    }

    public onUpdate(): void {
        this.changeScopeService.clearChangeScopeReq();

        if (this.feedback.forAllOrgs && this.feedback.publishForAllTenants) {
            this.publishForAllTenants();
            return;
        }

        if (this.feedback.forAllOrgs && this.feedback.unpublishForAllTenants) {
            this.unpublishForAllTenants();
            return;
        }

        if (this.feedback.data.length > 0) {
            this.handleMixedScope(this.feedback);
        }

        console.log("Please select some options...");
    }

    public onClose(): void {
        this.state = false;
        this.stateChange.emit(false);
    }
}
/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { PluginManager } from "../../services/plugin-manager.service";
import { ChangeScopeService } from "../../services/change-scope.service";
import { Subscription } from "rxjs";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";
import { OrganisationService } from "../../services/organisation.service";
import { Organisation } from "../../interfaces/Organisation";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html",
    styleUrls: ["./change-scope.component.scss"]
})
export class ChangeScope implements OnInit {
    private _state: boolean = false;
    private _action: string;
    public feedback: ScopeFeedback = new ScopeFeedback();
    public showTracker: boolean;
    public listOfOrgsPerPlugin: ChangeScopeItem[];
    public orgs: Organisation[];
    
    public watchOrgsSubs: Subscription;

    @Input()
    set state (val: boolean) {
        if (val === false) {
            this.feedback.reset();
            
            if (this.watchOrgsSubs) {
                this.watchOrgsSubs.unsubscribe();
            }
        }

        if (val === true) {
            this.showTracker = false;
        }

        this._state = val;
    }
    @Output() public stateChange = new EventEmitter<boolean>();

    @Input()
    set action(val: string) {
        this._action = val;
        this.loadListOfOrgsPerPlugin();
    }

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private pluginManager: PluginManager,
        private changeScopeService: ChangeScopeService,
        private orgService: OrganisationService
    ) {}

    public ngOnInit(): void {
        this.showTracker = false;
    }

    get state (): boolean {
        return this._state;
    }

    get action (): string {
        return this._action;
    }

    public handleMixedScope(feedback: ScopeFeedback): void {
        this.showTracker = true;

        const requests = this.pluginManager.handleMixedScope(this.pluginManager.selectedPlugins, feedback, true);
        requests.forEach((element) => {
            const subscription = element.req.subscribe(
                (res) => {
                    this.changeScopeService.changeReqStatusTo(res.url, true);
                    subscription.unsubscribe();
                },
                (err) => {
                    // Handle Error
                    this.changeScopeService.changeReqStatusTo(element.url, false);
                    subscription.unsubscribe();
                    console.warn(err);
                }
            )
        });
    }

    public onUpdate(): void {
        if (this.feedback.data.length > 0) {
            this.handleMixedScope(this.feedback);
            return;
        }

        console.log("Please select some options...");
    }

    public onClose(): void {
        this.state = false;
        this.stateChange.emit(false);
    }

    public loadListOfOrgsPerPlugin(): void {
        this.loadOrgs();
        this.populateList();
    }

    public loadOrgs(): void {
        this.orgs = this.orgService.orgs;
        this.watchOrgsSubs = this.orgService.watchOrgs().subscribe(
            (orgs) => {
                this.orgs = orgs;
                this.populateList();
            }
        )
    }

    public populateList(): void {
        this.listOfOrgsPerPlugin = [];
        this.orgs.forEach((org: Organisation) => {
            this.pluginManager.selectedPlugins.forEach(plugin => {
                this.listOfOrgsPerPlugin.push({ orgName: org.name, plugin: plugin.pluginName, action: this.action });           
            });
        });
    }
}
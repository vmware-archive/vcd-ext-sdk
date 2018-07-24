/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Output, EventEmitter, Input, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { Organisation } from "../../interfaces/Organisation";
import { OrganisationService } from "../../services/organisation.service";
import { Subscription, Observable } from "rxjs";
import { PluginManager } from "../../services/plugin-manager.service";
import { Plugin } from "../../interfaces/Plugin";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";

@Component({
    selector: "vcd-choose-scope",
    templateUrl: "./choose-scope.component.html",
    styleUrls: ["./choose-scope.component.scss"]
})
export class ChooseScope implements OnInit, OnDestroy {
    @Input() feedback: ScopeFeedback;
    @Output() feedbackChange = new EventEmitter<ScopeFeedback>();

    public orgs: Organisation[];
    public getOrgsSubs: Subscription;
    private selectedPlugins: Plugin[];
    private watchSelectedPluginsSub: Subscription;

    public list: ChangeScopeItem[];

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private orgsService: OrganisationService,
        private pluginManager: PluginManager
    ) {}

    ngOnInit() {
        this.feedback.forAllOrgs = true;
        this.loadData();
    }

    ngOnDestroy() {
        this.watchSelectedPluginsSub.unsubscribe();
        this.getOrgsSubs.unsubscribe();
    }

    public loadData(): void {
        this.watchSelectedPlugin();
        this.getOrgsSubs = this.getOrgs().subscribe((orgs: Organisation[]) => {
            this.orgs = orgs;
            this.populateList();
        });
        this.populateList();
    }

    public watchSelectedPlugin() {
        this.selectedPlugins = this.pluginManager.selectedPlugins;
        this.watchSelectedPluginsSub = this.pluginManager.watchSelectedPlugins().subscribe((selectedPlugins: Plugin[]) => {
            this.selectedPlugins = selectedPlugins;
        });
    }

    public onChange(): void {
        this.feedbackChange.emit(this.feedback);
    }

    public setItemValue(data: string, item: ChangeScopeItem): void {
        if (this.feedback.forAllOrgs) {
            return;
        }

        const found = this.list.find((el) => {
            return el === item
        });

        found.action = data;
        this.onChange();
    }

    public setFeedbackData(data: ChangeScopeItem[]): void {
        if (this.feedback.forAllOrgs) {
            return;
        }

        this.feedback.data = data;
        this.onChange();
    }

    public getOrgs(): Observable<Organisation[]> {
        this.orgs = this.orgsService.orgs;
        return this.orgsService.watchOrgs();
    }

    public populateList(): void {
        this.list = [];

        this.orgs.forEach((org: Organisation) => {
            this.selectedPlugins.forEach(plugin => {
                this.list.push({ orgName: org.name, plugin, action: 'none' });             
            });
        });
    }
}
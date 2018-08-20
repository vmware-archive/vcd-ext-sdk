/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";

@Component({
    selector: "vcd-choose-tenant-scope",
    templateUrl: "./choose-tenant-scope.component.html",
    styleUrls: ["./choose-tenant-scope.component.scss"]
})
export class ChooseTenantScope implements OnInit {
    private _listOfOrgsPerPlugin: ChangeScopeItem[];
    private _feedback: ScopeFeedback;
    private _scope = "unpublishForAllTenants";

    @Input()
    set listOfOrgsPerPlugin(data: ChangeScopeItem[]) {
        this._listOfOrgsPerPlugin = data;
    };
    @Input()
    set feedback(data: ScopeFeedback){
        this._feedback = data;

        this.initialSelection();
    }
    @Input() showDontPublish = true;
    @Output() feedbackChange = new EventEmitter<ScopeFeedback>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}

    get listOfOrgsPerPlugin(): ChangeScopeItem[] {
        return this._listOfOrgsPerPlugin;
    }

    get feedback(): ScopeFeedback {
        return this._feedback;
    }

    set scope(data: string) {
        this._scope = data;

        this.feedback.unpublishForAllTenants = this.scope === "unpublishForAllTenants";
        this.feedback.publishForAllTenants = this.scope === "publishForAllTenants";
        this.feedback.forSpecificTenants = this.scope === "forSpecificTenants";

        this.onChange();
    }

    get scope(): string {
        return this._scope;
    }

    public onChange(): void {
        this.feedbackChange.emit(this.feedback);
    }

    public setFeedbackData(data: ChangeScopeItem[]): void {
        if (this.feedback.publishForAllTenants || this.feedback.unpublishForAllTenants) {
            return;
        }

        this.feedback.data = data;
        this.onChange();
    }

    public initialSelection(): void {
        if (this.feedback.publishForAllTenants) {
            this.scope = "publishForAllTenants";
            return;
        }

        if (this.feedback.unpublishForAllTenants) {
            this.scope = "unpublishForAllTenants";
            return;
        }

        this.scope = "forSpecificTenants";
    }
}

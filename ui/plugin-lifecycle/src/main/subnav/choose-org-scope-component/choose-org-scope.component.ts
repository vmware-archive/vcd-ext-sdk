/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";

@Component({
    selector: "vcd-choose-org-scope",
    templateUrl: "./choose-org-scope.component.html",
    styleUrls: ["./choose-org-scope.component.scss"]
})
export class ChooseOrgScope implements OnInit {
    private _listOfOrgsPerPlugin: ChangeScopeItem[];

    @Input()
    set listOfOrgsPerPlugin(data: ChangeScopeItem[]) {
        this._listOfOrgsPerPlugin = data;
    };
    @Input() feedback: ScopeFeedback;
    @Input() showDontPublish = true;
    @Output() feedbackChange = new EventEmitter<ScopeFeedback>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}

    get listOfOrgsPerPlugin(): ChangeScopeItem[] {
        return this._listOfOrgsPerPlugin;
    }

    public onRadioChange(data: any): void {
        const id = data.target.id;

        this.feedback.publishForAllTenants = false;
        this.feedback.unpublishForAllTenants = false;

        if (id === "publishForAllTenants") {
            this.feedback.publishForAllTenants = true;
            this.feedback.unpublishForAllTenants = false;
        }

        if (id === "unpublishForAllTenants") {
            this.feedback.unpublishForAllTenants = true;
            this.feedback.publishForAllTenants = false;
        }

        this.onChange();
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
}

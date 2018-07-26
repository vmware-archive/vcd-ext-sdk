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
    @Input() listOfOrgsPerPlugin: ChangeScopeItem[];
    @Input() feedback: ScopeFeedback;
    @Input() canUnpublish: boolean = true;
    @Output() feedbackChange = new EventEmitter<ScopeFeedback>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}

    public onChange(): void {
        this.feedbackChange.emit(this.feedback);
    }

    public setItemValue(data: string, item: ChangeScopeItem): void {
        if (this.feedback.forAllOrgs) {
            return;
        }

        const found = this.listOfOrgsPerPlugin.find((el) => {
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
}
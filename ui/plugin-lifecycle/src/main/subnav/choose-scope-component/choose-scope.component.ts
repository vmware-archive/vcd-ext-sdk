/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { ChangeScopeItem } from "../../interfaces/ChangeScopeItem";

@Component({
    selector: "vcd-choose-scope",
    templateUrl: "./choose-scope.component.html",
    styleUrls: ["./choose-scope.component.scss"]
})
export class ChooseScope implements OnInit {
    @Input() listOfOrgsPerPlugin: ChangeScopeItem[];
    @Input() feedback: ScopeFeedback;
    @Output() feedbackChange = new EventEmitter<ScopeFeedback>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {
        this.feedback.forAllOrgs = true;
    }

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
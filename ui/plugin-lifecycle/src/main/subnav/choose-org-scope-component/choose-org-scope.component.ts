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

    private _providerScope: boolean;
    private _tenantScope: boolean;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}

    get providerScope(): boolean {
        return this._providerScope;
    }

    set providerScope(val: boolean) {
        this._providerScope = val;

        if (this.providerScope) {
            this.feedback.addNewScope('service-provider');
        } else {
            this.feedback.removeScope('service-provider');
        }

        this.onChange();
    }

    get tenantScope(): boolean {
        return this._tenantScope;
    }

    set tenantScope(val: boolean) {
        this._tenantScope = val;

        if (this.tenantScope) {
            this.feedback.addNewScope('tenant');
        } else {
            this.feedback.removeScope('tenant');
        }

        this.onChange();
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
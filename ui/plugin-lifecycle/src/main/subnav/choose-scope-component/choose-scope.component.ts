/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { Organisation } from "../../interfaces/Organisation";

@Component({
    selector: "vcd-choose-scope",
    templateUrl: "./choose-scope.component.html"
})
export class ChooseScope implements OnInit {
    @Input() feedback: ScopeFeedback;
    @Output() feedbackChange = new EventEmitter<ScopeFeedback>();
    public selectedOrgs: Organisation[];
    public orgs: Organisation[];

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {
        this.orgs = [
            { id: '1', name: "My-Very-Frist-Org1" },
            { id: '2', name: "My-Very-Frist-Org2" },
            { id: '3', name: "My-Very-Frist-Org3" }
        ]
    }

    onChange(): void {
        this.feedbackChange.emit(this.feedback);
    }
}
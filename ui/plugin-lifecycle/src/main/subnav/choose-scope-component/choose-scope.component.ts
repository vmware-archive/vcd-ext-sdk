/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ChangeScopeFeedback } from "../../classes/ChangeScopeFeedback";

@Component({
    selector: "vcd-choose-scope",
    templateUrl: "./choose-scope.component.html"
})
export class ChooseScope implements OnInit {
    @Input() feedback: ChangeScopeFeedback;
    @Output() feedbackChange = new EventEmitter<any>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}

    onChange(): void {
        this.feedbackChange.emit(this.feedback);
    }
}
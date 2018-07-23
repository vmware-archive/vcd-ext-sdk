/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html"
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
    @Output() public scopeChange = new EventEmitter<ScopeFeedback>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}

    get state (): boolean {
        return this._state;
    }

    public onUpdate(): void {
        this.scopeChange.emit(this.feedback);
    }

    public onClose(): void {
        this.stateChange.emit(false);
    }
}
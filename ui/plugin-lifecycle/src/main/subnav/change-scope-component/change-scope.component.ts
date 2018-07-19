/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ChangeScopeFeedback } from "../../classes/ChangeScopeFeedback";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html"
})
export class ChangeScope implements OnInit {
    private _state: boolean;
    public feedback: ChangeScopeFeedback = new ChangeScopeFeedback();
    @Input()
    set state (val: boolean) {
        if (val === false) {
            this.clearData();
        }

        this._state = val;
    }
    @Output() public changeState = new EventEmitter<boolean>();
    @Output() public changeScope = new EventEmitter<ChangeScopeFeedback>();

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string
    ) {}

    ngOnInit() {}

    get state (): boolean {
        return this._state;
    }

    public onUpdate(): void {
        this.changeScope.emit(this.feedback);
    }

    public clearData(): void {
        this.feedback.forTenant = false;
        this.feedback.forAllTenants = false;
    }

    public onClose(): void {
        this.state = false;
    }
}
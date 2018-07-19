/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";

/**
 * Loading indicator for blocking modal dialogs while loading.
 */
@Component({
   selector: "vcd-error-notifyer",
   templateUrl: "error-notifyer.component.html"
})
export class ErrorNotifyerComponent implements OnInit {
    @Input()
    set opened(val: boolean) {
        this._opened = val;
        this.openedChange.emit(val);
    }
    @Output() openedChange = new EventEmitter<boolean>();
    private _opened: boolean;

    constructor() {}

    ngOnInit() {}

    get opened(): boolean {
        return this._opened;
    }

}
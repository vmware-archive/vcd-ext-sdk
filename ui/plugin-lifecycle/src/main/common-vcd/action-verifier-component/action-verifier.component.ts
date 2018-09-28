/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ModalWindow } from "../../interfaces/Modal";
import { ActionVerifierService } from "../action-verifier.service";
import { Subscription } from "rxjs";

@Component({
    selector: "vcd-action-verifier",
    templateUrl: "./action-verifier.component.html"
})
export class ActionVerifierComponent implements OnInit, OnDestroy {
    public modal: ModalWindow;

    public subs: Subscription;

    constructor(
        private actionVerifierService: ActionVerifierService
    ) {}

    public ngOnInit() {
        this.modal = this.actionVerifierService.modal;

        this.subs = this.actionVerifierService.watchModalState().subscribe((modal: ModalWindow) => {
            // Handle data
            this.modal = modal;
        }, (err) => {
            // Handle error
        }, () => {
            // Handle complete
        });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public emitAndClose(val: boolean) {
        this.actionVerifierService.emitAndClose(val);
    }
}

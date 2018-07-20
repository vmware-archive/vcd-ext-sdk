/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import { ScopeFeedback } from "../../classes/ScopeFeedback";

@Component({
    selector: "vcd-choose-scope",
    templateUrl: "./choose-scope.component.html"
})
export class ChooseScope implements OnInit {
    private _feedback: ScopeFeedback;

    private _enableForProviders: boolean;
    private _enableForTenants: boolean;

    @Input()
    set feedback(val: ScopeFeedback) {
        this._feedback = val;

        if (this.feedback.scope.indexOf("service-provider") !== -1) {
            this.enableForProviders = true;
        }

        if (this.feedback.scope.indexOf("tenant") !== -1 ) {
            this.enableForTenants = true;
        }
    }

    @Output() feedbackChange = new EventEmitter<ScopeFeedback>();

    constructor() {}

    ngOnInit() {
        this.orgs = [
            { id: '1', name: "My-Very-Frist-Org1" },
            { id: '2', name: "My-Very-Frist-Org2" },
            { id: '3', name: "My-Very-Frist-Org3" }
        ]
        this.getOrgs();
    }

    get feedback(): ScopeFeedback {
        return this._feedback;
    }

    get enableForProviders(): boolean {
        return this._enableForProviders;
    }

    set enableForProviders(val: boolean) {
        this._enableForProviders = val;

        if (this.enableForProviders) {
            this.feedback.addNewScope("service-provider");
        } else {
            this.feedback.removeScope("service-provider");
        }

        this.feedbackChange.emit(this.feedback);
    }

    get enableForTenants(): boolean {
        return this._enableForTenants;
    }

    set enableForTenants(val: boolean) {
        this._enableForTenants = val;

        if (this.enableForTenants) {
            this.feedback.addNewScope("tenant");
        } else {
            this.feedback.removeScope("tenant");
        }

        this.feedbackChange.emit(this.feedback);
    }
}

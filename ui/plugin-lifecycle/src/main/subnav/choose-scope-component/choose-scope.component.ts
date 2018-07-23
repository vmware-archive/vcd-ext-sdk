/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, Output, EventEmitter, Input, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd-ui/common";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { Organisation } from "../../interfaces/Organisation";
import { OrganisationService } from "../../services/organisation.service";
import { Subscription } from "rxjs";

@Component({
    selector: "vcd-choose-scope",
    templateUrl: "./choose-scope.component.html"
})
export class ChooseScope implements OnInit, OnDestroy {
    @Input() feedback: ScopeFeedback;
    @Output() feedbackChange = new EventEmitter<ScopeFeedback>();
    public selectedOrgs: Organisation[];
    public orgs: Organisation[];
    public getOrgsSubs: Subscription;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private orgsService: OrganisationService
    ) {}

    ngOnInit() {
        this.getOrgs();
    }

    ngOnDestroy() {
        this.getOrgsSubs.unsubscribe();
        this.selectedOrgs = [];
    }

    public onChange(): void {
        this.feedbackChange.emit(this.feedback);
    }

    public getOrgs(): void {
        this.orgs = this.orgsService.orgs;
        this.getOrgsSubs = this.orgsService.watchOrgs().subscribe((orgs: Organisation[]) => {
            this.orgs = orgs;
        });
    }
}
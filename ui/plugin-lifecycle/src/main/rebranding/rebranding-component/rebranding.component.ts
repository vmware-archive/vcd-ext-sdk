/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { EXTENSION_ASSET_URL } from "@vcd/sdk/common";
import { FormGroup } from "@angular/forms";
import { RebrandingControlService } from "../../services/rebranding-control.service";
import { TagListService } from "../../services/taglist.service";
import { Subscription, Observable } from "rxjs";
import { RebrandingService } from "../../services/rebranding.service";
import { FieldBase } from "../../classes/dynamic-fields/field-base";

@Component({
    selector: "vcd-rebranding",
    templateUrl: "./rebranding.component.html",
    styleUrls: ["./rebranding.component.scss"]
})
export class RebrandingComponent implements OnInit, OnDestroy {
    public submitted = false;
    public rebrandingForm: FormGroup;
    public fields: FieldBase<any>[] = [];

    public subs: Subscription;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private rebrandingCtrlService: RebrandingControlService,
        private tagListService: TagListService,
        private rebrandingService: RebrandingService
    ) { }

    public ngOnInit() {
        this.subs = this.rebrandingCtrlService.getFields().subscribe((fields: FieldBase<any>[]) => {
            this.fields = fields;
            this.rebrandingForm = this.rebrandingCtrlService.toFormGroup(this.fields);

            const sub = this.tagListService.getTags().subscribe((tags: string[]) => {
                const cusotmLinks = this.rebrandingForm.get("customLinks");
                if (cusotmLinks) {
                    cusotmLinks.setValue(`${tags.toLocaleString()},`);
                }
            });
            this.subs.add(sub);
        });
    }

    public ngOnDestroy() {
        this.subs.unsubscribe();
    }

    public onSubmit(): void {
        const theme = <string[]>this.rebrandingForm.get("theme").value.split(",");
        let customLinks: string[] = [];

        if (this.rebrandingForm.get("customLinks")) {
            customLinks = <string[]>this.rebrandingForm.get("customLinks").value.split(",");
            customLinks.splice(customLinks.length - 1, 1);
        }

        const sub = Observable.merge(
            this.rebrandingService.putTemeData({
                portalName: this.rebrandingForm.get("portalName").value,
                portalColor: this.rebrandingForm.get("colorPicker").value,
                selectedTheme: {
                    themeType: theme[0],
                    name: theme[1]
                },
                customLinks
            })
        ).subscribe((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        }, () => {
            console.log("Change completed!");
        });
        this.subs.add(sub);
    }
}

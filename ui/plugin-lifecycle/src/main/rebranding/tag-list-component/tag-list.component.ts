/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {Component, Inject, Output, EventEmitter, ViewChild, Input, OnInit, OnDestroy} from "@angular/core";
import {EXTENSION_ASSET_URL} from "@vcd/sdk/common";
import { TagListService } from "../../services/taglist.service";
import { Subscription } from "rxjs";

@Component({
    selector: "vcd-taglist",
    templateUrl: "./tag-list.component.html",
    styleUrls: [
        "./tag-list.component.scss"
    ]
})
export class TagListComponent implements OnInit, OnDestroy {
    @ViewChild("input") input: any;
    @Output() tagsChange = new EventEmitter<string[]>();
    @Input() maxWidth(value: number) {
        this.customStyles['max-width'] = `${value}px`;
    }
    @Input() placeholder = "Enter here..."
    public tags: string[] = [];
    public customStyles: any = {}

    public subs: Subscription;

    constructor(
        @Inject(EXTENSION_ASSET_URL) public assetUrl: string,
        private tagListService: TagListService
    ) {}

    public ngOnInit(): void {
        this.subs = this.tagListService.getTags().subscribe((tags: string[]) => {
            this.tags = tags;
        });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public addTag(event: any): void {
        event.stopPropagation();

        if (this.input.length < 8) {
            return;
        }

        this.tagListService.addTag(this.input.nativeElement.value);
        this.input.nativeElement.value = "";
        this.tagsChange.emit(this.tags);
    }

    public removeTag(tag: string): void {
        this.tagListService.removeTag(tag);
        this.tagsChange.emit(this.tags);
    }
}
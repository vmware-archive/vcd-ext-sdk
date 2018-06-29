/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import { Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import { ScopeFeedback } from "../../classes/ScopeFeedback";
import { ChangeScopeService } from "../../services/change-scope.service";
import { PluginManager } from "../../services/plugin-manager.service";

@Component({
    selector: "vcd-change-scope",
    templateUrl: "./change-scope.component.html"
})
export class ChangeScope implements OnInit {
    public feedback = new ScopeFeedback();
    public loading: boolean = false;
    private _open: boolean = false;

    @Input() 
    set open(val: boolean) {
        this._open = val;
    }
    @Output() openChange = new EventEmitter<boolean>();

    constructor(
        private changeScopeService: ChangeScopeService,
        private pluginManager: PluginManager
    ) { }

    ngOnInit() {}

    get open(): boolean {
        return this._open;
    }

    public changeScope(): void {
        this.loading = true;
        const subs = this.changeScopeService.changeScope(this.pluginManager.selectedPlugins, this.feedback.scope, this.pluginManager.baseUrl)
            .subscribe((res) => {
                console.log(res);
            }, (err) => {
                // Handle err
                console.warn(err);
            }, () => {
                this.loading = false;
                subs.unsubscribe();
            });
    }

    public onClose(): void {
        this.open = false;
        this.feedback.reset();
        this.openChange.emit(false);
    }
}
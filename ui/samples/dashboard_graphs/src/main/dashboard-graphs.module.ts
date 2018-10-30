/** vcloud-director-ui-extension-sample-about-page
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {Inject, NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {Store} from "@ngrx/store";
import {VcdSdkModule, VcdApiClient, common} from "@vcd/sdk";
import {ClarityModule} from "clarity-angular";
import {ROUTES} from "./dashboard-graphs.routes";
import {DashboardGraphsComponent} from "./dashboard-graphs.component";
import {DashboardGraphComponent} from "./dashboard-graph.component";
import {AddDashboardGraphModalComponent} from "./add-dashboard-graph-modal.component";
import {DashboardGraphsRendererService} from "./dashboard-graphs-renderer.service";
import {DashboardGraphsSamplerService} from "./dashboard-graphs-sampler.service";
import {DashboardGraphsSettingsService} from "./dashboard-graphs-settings.service";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        ReactiveFormsModule,
        ClarityModule,
        VcdSdkModule
    ],
    declarations: [
        DashboardGraphsComponent,
        DashboardGraphComponent,
        AddDashboardGraphModalComponent
    ],
    bootstrap: [
        DashboardGraphsComponent
    ],
    providers: [
        VcdApiClient,
        DashboardGraphsRendererService,
        DashboardGraphsSamplerService,
        DashboardGraphsSettingsService
    ]
})
export class DashboardGraphsModule {
    constructor(private appStore: Store<any>, @Inject(common.EXTENSION_ROUTE) extensionRoute: string) {
    }
}

/** vcloud-director-ui-extension-sample-about-page
 *  SPDX-License-Identifier: BSD-2-Clause
 *  Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */
import {CommonModule} from "@angular/common";
import {Inject, NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {Store} from "@ngrx/store";
import {EXTENSION_ROUTE, ExtensionNavRegistration, ExtensionNavRegistrationAction} from "@vcd-ui/common";
import {AboutComponent} from "./about.component";
import {ROUTES} from "./about.routes";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        AboutComponent
    ],
    bootstrap: [
        AboutComponent
    ]
})
export class AboutModule {
    constructor(private appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string) {
        const registration: ExtensionNavRegistration = {
            icon: "cog",
            path: extensionRoute,
            nameCode: "nav.about",
            descriptionCode: "nav.about.description"
        };
        appStore.dispatch(new ExtensionNavRegistrationAction(registration));
    }
}

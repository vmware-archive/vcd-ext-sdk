/*
 * Copyright 2017 VMware, Inc. All rights reserved. VMware Confidential
 */
import {CommonModule} from "@angular/common";
import {Inject, NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {Store} from "@ngrx/store";
import {EXTENSION_ROUTE, ExtensionNavRegistration, ExtensionNavRegistrationAction, I18nModule} from "@vcd-ui/common";
import {StubComponent} from "./stub.component";
import {ROUTES} from "./stub.routes";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTES),
        I18nModule
    ],
    declarations: [
        StubComponent
    ],
    entryComponents: [
        StubComponent
    ],
    exports: [],
    providers: []
})
export class StubModule {
    constructor(private appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string) {
        const registration: ExtensionNavRegistration = {
            path: extensionRoute,
            icon: "page",
            nameCode: "nav.stub",
            descriptionCode: "nav.stub.description"
        };
        appStore.dispatch(new ExtensionNavRegistrationAction(registration));
    }
}

import {CommonModule} from "@angular/common";
import {Inject, NgModule, Optional} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ClarityModule} from "clarity-angular";
import {Store} from "@ngrx/store";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { EXTENSION_ROUTE, ExtensionNavRegistration, ExtensionNavRegistrationAction, I18nModule } from "@vcd/sdk/common";
import {SimpleComponent} from "./simple/simple.component";

const ROUTES: Routes = [
    { path: "", component: SimpleComponent }
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        I18nModule,
        VcdSdkModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        SimpleComponent
    ],
    bootstrap: [SimpleComponent],
    exports: [],
    providers: [VcdApiClient]
})
export class SimplePluginModule {
    constructor(private appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string) {
        const registration: ExtensionNavRegistration = {
            path: extensionRoute,
            icon: "page",
            nameCode: "nav.label",
            descriptionCode: "nav.description"
        };

        appStore.dispatch(new ExtensionNavRegistrationAction(registration));
    }
}

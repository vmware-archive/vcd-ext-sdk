import {CommonModule} from "@angular/common";
import {Inject, NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ClarityModule} from "clarity-angular";
import {Store} from "@ngrx/store";
import {EXTENSION_ROUTE, ExtensionNavRegistration, ExtensionNavRegistrationAction, I18nModule} from "@vcd-ui/common";
import {SimpleComponent} from "./simple/simple.component";

const ROUTES: Routes = [
    { path: "", component: SimpleComponent }
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        I18nModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        SimpleComponent
    ],
    bootstrap: [SimpleComponent],
    exports: [],
    providers: []
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

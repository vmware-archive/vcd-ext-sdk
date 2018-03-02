import {CommonModule} from "@angular/common";
import {Inject, NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {ClarityModule} from "clarity-angular";
import {Store} from "@ngrx/store";
import {EXTENSION_ROUTE, ExtensionNavRegistration, ExtensionNavRegistrationAction, I18nModule} from "@vcd-ui/common";
import {SubnavComponent} from "./subnav/subnav.component";
import {AboutComponent} from "./subnav/about.component";
import {StatusComponent} from "./subnav/status.component";

const ROUTES: Routes = [
    { path: "", component: SubnavComponent, children: [
        { path: "", redirectTo: "status", pathMatch: "full" },
        { path: "status", component: StatusComponent },
        { path: "about", component: AboutComponent }
    ]}
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        I18nModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        AboutComponent,
        StatusComponent,
        SubnavComponent
    ],
    bootstrap: [SubnavComponent],
    exports: [],
    providers: []
})
export class SubnavPluginModule {
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

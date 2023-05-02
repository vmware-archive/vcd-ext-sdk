import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Store } from "@ngrx/store";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { ExtensionNavRegistration, EXTENSION_ROUTE } from "@vcd/sdk/common";
import { PluginModule } from "@vcd/sdk/core";
import { ClarityModule } from "clarity-angular";
import { AboutComponent } from "./subnav/about.component";
import { StatusComponent } from "./subnav/status.component";
import { SubnavComponent } from "./subnav/subnav.component";

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
        VcdSdkModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        AboutComponent,
        StatusComponent,
        SubnavComponent
    ],
    bootstrap: [SubnavComponent],
    exports: [],
    providers: [VcdApiClient]
})
export class SubnavPluginModule extends PluginModule {
    constructor(appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string) {
        super(appStore);

        this.registerExtension(<ExtensionNavRegistration>{
            path: extensionRoute,
            icon: "page",
            nameCode: "nav.label",
            descriptionCode: "nav.description"
        });
    }
}

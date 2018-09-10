import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { ClarityModule } from "clarity-angular";
import { Store } from "@ngrx/store";
import { EXTENSION_ROUTE, ExtensionNavRegistration } from "@vcd/sdk/common";
import { SubnavComponent } from "./subnav/subnav.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { VcdSdkModule } from "@vcd/sdk";
import { PluginModule } from "@vcd/sdk/core";
import { TranslateService } from "@vcd/sdk/i18n";
import { LifecycleManagement } from "./lifecycle-management/lifecycle-management.module";
import { RebrandingPluginModule } from "./rebranding/rebranding-plugin.module";
import { StatusComponent } from "./lifecycle-management/status-component/status.component";
import { RebrandingComponent } from "./rebranding/rebranding-component/rebranding.component";

const ROUTES: Routes = [
    { path: "", redirectTo: "plugin-management", pathMatch: "full" },
    { path: "", component: SubnavComponent, children: [
        { path: "plugin-management", component: StatusComponent },
        { path: "vcd-rebranding", component: RebrandingComponent }
    ] }
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        VcdSdkModule,
        LifecycleManagement,
        RebrandingPluginModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        SubnavComponent
    ],
    bootstrap: [SubnavComponent],
    exports: [],
    providers: []
})
export class SubnavPluginModule extends PluginModule {
    constructor(appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string, translate: TranslateService) {
        super(appStore, translate);
        this.registerExtension(<ExtensionNavRegistration>{
            path: extensionRoute,
            icon: "page",
            nameCode: "nav.label",
            descriptionCode: "nav.description"
        });
    }
}

import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Store } from "@ngrx/store";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { ExtensionNavRegistration, EXTENSION_ROUTE } from "@vcd/sdk/common";
import { PluginModule } from "@vcd/sdk/core";
import { TranslateService } from "@vcd/sdk/i18n";
import { ClarityModule } from "@clr/angular";
import { <%- nameCamelCase %>Component } from "./<%- name %>/<%- name %>.component";

const ROUTES: Routes = [
    { path: "", component: <%- nameCamelCase %>Component }
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        VcdSdkModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        <%- nameCamelCase %>Component
    ],
    bootstrap: [<%- nameCamelCase %>Component],
    exports: [],
    providers: [VcdApiClient]
})
export class <%- nameCamelCase %>PluginModule extends PluginModule {
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

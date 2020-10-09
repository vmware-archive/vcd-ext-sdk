import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Store } from "@ngrx/store";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { ExtensionNavRegistration, EXTENSION_ROUTE, EXTENSION_ASSET_URL } from "@vcd/sdk/common";
import { PluginModule } from "@vcd/sdk/core";
import { I18nModule, TranslationService } from "@vcd/i18n";
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
        I18nModule.forChild(EXTENSION_ASSET_URL, false),
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
    constructor(appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string, translationService: TranslationService) {
        super(appStore);
        translationService.registerTranslations()
        this.registerExtension(<ExtensionNavRegistration>{
            path: extensionRoute,
            icon: "page",
            nameCode: "nav.label",
            descriptionCode: "nav.description"
        });
    }
}

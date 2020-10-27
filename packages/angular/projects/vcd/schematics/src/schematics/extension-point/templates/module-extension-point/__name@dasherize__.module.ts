import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Store } from "@ngrx/store";
import { VcdApiClient, VcdSdkModule, PluginModule, ExtensionNavRegistration, EXTENSION_ROUTE, EXTENSION_ASSET_URL } from "@vcd/sdk";
import { TranslationService, I18nModule} from "@vcd/i18n";
import { ClarityModule } from "@clr/angular";
import { SimpleComponent } from "./simple/simple.component";

const ROUTES: Routes = [
    { path: "", component: SimpleComponent }
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        VcdSdkModule,
        I18nModule.forChild(EXTENSION_ASSET_URL, true),
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        SimpleComponent
    ],
    bootstrap: [SimpleComponent],
    exports: [],
    providers: [VcdApiClient]
})
export class <%= classify(name) %>Module extends PluginModule {
    constructor(appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string, translate: TranslationService) {
        super(appStore);
        translate.registerTranslations(null);
        this.registerExtension(<ExtensionNavRegistration>{
            path: extensionRoute,
            icon: "page",
            nameCode: "nav.label",
            descriptionCode: "nav.description"
        });
    }
}

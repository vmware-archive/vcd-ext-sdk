import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { ClarityModule } from "clarity-angular";
import { Store } from "@ngrx/store";
import { EXTENSION_ROUTE, ExtensionNavRegistration } from "@vcd/sdk/common";
import { SubnavComponent } from "./subnav/subnav.component";
import { StatusComponent } from "./subnav/status-component/status.component";
import { PluginManager } from "./services/plugin-manager.service";
import { UploadComponent } from "./subnav/upload-component/upload-component";
import { FormsModule } from "@angular/forms";
import { LoadingIndicatorComponent } from "./subnav/loading-indicator-component/loading-indicator.component";
import { ZipManager } from "./services/zip-manager.service";
import { UploadZipField } from "./subnav/upload-zip-field-component/upload-zip-field.component";
import { VcdAlert } from "./subnav/alert-component/alert.component";
import { VcdManifestStackView } from "./subnav/manifest-stack-view-component/manifest-stack-view.component";
import { ChangeTenantScope } from "./subnav/change-tenant-scope-component/change-tenant-scope.component";
import { ChooseTenantScope } from "./subnav/choose-tenant-scope-component/choose-tenant-scope.component";
import { TenantService } from "./services/tenant.service";
import { ChangeTenantScopeTracker } from "./subnav/change-tenant-scope-tracker-component/change-tenant-scope-tracker.component";
import { PluginUploaderService } from "./services/plugin-uploader.service";
import { PluginPublisher } from "./services/plugin-publisher.service";
import { CapitalizeFirstPipe } from "./pipes/capitalizefirst/capitalizefirst.pipe";
import { ChangeScope } from "./subnav/change-scope-component/change-scope.component";
import { ChooseScope } from "./subnav/choose-scope-component/choose-scope.component";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ErrorNotifyerComponent } from "./subnav/error-notifyer-component/error-notifyer.component";
import { VcdHttpTransferServiceModule } from "@vcd/http-transfer-service";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { PluginModule } from "@vcd/sdk/core";
import { TranslateService } from "@vcd/sdk/i18n";
import { PluginService } from "./services/plugin.service";

const ROUTES: Routes = [
    {
        path: "", component: SubnavComponent, children: [
            { path: "", redirectTo: "plugin-management", pathMatch: "full" },
            { path: "plugin-management", component: StatusComponent }
        ]
    }
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        VcdSdkModule,
        VcdHttpTransferServiceModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        CapitalizeFirstPipe,
        StatusComponent,
        SubnavComponent,
        UploadComponent,
        UploadZipField,
        VcdAlert,
        VcdManifestStackView,
        ChangeScope,
        ChooseScope,
        ChangeTenantScope,
        ChooseTenantScope,
        ChangeTenantScopeTracker,
        LoadingIndicatorComponent,
        ErrorNotifyerComponent
    ],
    bootstrap: [SubnavComponent],
    exports: [],
    providers: [
        VcdApiClient,
        PluginService,
        TenantService,
        PluginPublisher,
        PluginUploaderService,
        PluginManager,
        ZipManager
    ],
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

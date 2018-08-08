import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { ClarityModule } from "clarity-angular";
import { Store } from "@ngrx/store";
import { EXTENSION_ROUTE, ExtensionNavRegistration } from "@vcd-ui/common";
import { SubnavComponent } from "./subnav/subnav.component";
import { AboutComponent } from "./subnav/about.component";
import { StatusComponent } from "./subnav/status-component/status.component";
import { PluginManager } from "./services/plugin-manager.service";
import { UploadComponent } from "./subnav/upload-component/upload-component";
import { FormsModule } from "@angular/forms";
import { LoadingIndicatorComponent } from "./subnav/loading-indicator-component/loading-indicator.component";
import { ZipManager } from "./services/zip-manager.service";
import { UploadZipField } from "./subnav/upload-zip-field-component/upload-zip-field.component";
import { VcdAlert } from "./subnav/alert-component/alert.component";
import { VcdManifestStackView } from "./subnav/manifest-stack-view-component/manifest-stack-view.component";
import { ChangeOrgScope } from "./subnav/change-org-scope-component/change-org-scope.component";
import { ChooseOrgScope } from "./subnav/choose-org-scope-component/choose-org-scope.component";
import { OrganisationService } from "./services/organisation.service";
import { ChangeOrgScopeTracker } from "./subnav/change-org-scope-tracker-component/change-org-scope-tracker.component";
import { ChangeOrgScopeService } from "./services/change-org-scope.service";
import { PluginUploaderService } from "./services/plugin-uploader.service";
import { PluginPublisher } from "./services/plugin-publisher.service";
import { CapitalizeFirstPipe } from "./pipes/capitalizefirst/capitalizefirst.pipe";
import { ChangeScope } from "./subnav/change-scope-component/change-scope.component";
import { ChooseScope } from "./subnav/choose-scope-component/choose-scope.component";
import { HttpClientModule } from "@angular/common/http";
import { ErrorNotifyerComponent } from "./subnav/error-notifyer-component/error-notifyer.component";
import { VcdHttpTransferServiceModule } from "@vcd/http-transfer-service";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { PluginModule } from "@vcd/sdk/core";
import { TranslateService } from "@vcd/sdk/i18n";
import { PluginService } from "./services/plugin.service";

const ROUTES: Routes = [
    {
        path: "", component: SubnavComponent, children: [
            { path: "", redirectTo: "status", pathMatch: "full" },
            { path: "status", component: StatusComponent },
            { path: "about", component: AboutComponent }
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
        AboutComponent,
        StatusComponent,
        SubnavComponent,
        UploadComponent,
        UploadZipField,
        VcdAlert,
        VcdManifestStackView,
        ChangeScope,
        ChooseScope,
        ChangeOrgScope,
        ChooseOrgScope,
        ChangeOrgScopeTracker,
        LoadingIndicatorComponent,
        ErrorNotifyerComponent
    ],
    bootstrap: [SubnavComponent],
    exports: [],
    providers: [
        VcdApiClient,
        PluginService,
        OrganisationService,
        ChangeOrgScopeService,
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

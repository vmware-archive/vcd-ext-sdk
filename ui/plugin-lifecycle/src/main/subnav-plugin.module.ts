import {CommonModule} from "@angular/common";
import {Inject, NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HttpModule} from "@angular/http";
import {ClarityModule} from "clarity-angular";
import {Store} from "@ngrx/store";
import {EXTENSION_ROUTE, ExtensionNavRegistration, ExtensionNavRegistrationAction, I18nModule} from "@vcd-ui/common";
import {SubnavComponent} from "./subnav/subnav.component";
import {AboutComponent} from "./subnav/about.component";
import {StatusComponent} from "./subnav/status-component/status.component";
import {PluginManager} from "./services/plugin-manager.service";
import {UploadComponent} from "./subnav/upload-component/upload-component";
import {FormsModule} from "@angular/forms";
import { LoadingIndicatorComponent } from "./subnav/loading-indicator-component/loading-indicator.component";
import { ZipManager } from "./services/zip-manager.service";
import { UploadZipField } from "./subnav/upload-zip-field-component/upload-zip-field.component";
import { VcdAlert } from "./subnav/alert-component/alert.component";
import { VcdManifestStackView } from "./subnav/manifest-stack-view-component/manifest-stack-view.component";
import { AuthService } from "./services/auth.service";
import { ChangeScope } from "./subnav/change-scope-component/change-scope.component";

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
        HttpModule,
        I18nModule,
        FormsModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        AboutComponent,
        StatusComponent,
        SubnavComponent,
        UploadComponent,
        UploadZipField,
        VcdAlert,
        VcdManifestStackView,
        ChangeScope,
        LoadingIndicatorComponent
    ],
    bootstrap: [SubnavComponent],
    exports: [],
    providers: [
        AuthService,
        OrganisationService,
        ChangeOrgScopeService,
        ChangeScopeService,
        DeletePluginService,
        DisableEnablePluginService,
        PluginPublisher,
        PluginUploaderService,
        PluginManager,
        ZipManager
    ]
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

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { ClarityModule } from "clarity-angular";
import { StatusComponent } from "./status-component/status.component";
import { PluginManager } from "../services/plugin-manager.service";
import { UploadComponent } from "./upload-component/upload-component";
import { FormsModule } from "@angular/forms";
import { LoadingIndicatorComponent } from "./loading-indicator-component/loading-indicator.component";
import { ZipManager } from "../services/zip-manager.service";
import { UploadZipField } from "./upload-zip-field-component/upload-zip-field.component";
import { VcdAlert } from "./alert-component/alert.component";
import { VcdManifestStackView } from "./manifest-stack-view-component/manifest-stack-view.component";
import { ChangeTenantScope } from "./change-tenant-scope-component/change-tenant-scope.component";
import { ChooseTenantScope } from "./choose-tenant-scope-component/choose-tenant-scope.component";
import { TenantService } from "../services/tenant.service";
import { ChangeTenantScopeTracker } from "./change-tenant-scope-tracker-component/change-tenant-scope-tracker.component";
import { PluginUploaderService } from "../services/plugin-uploader.service";
import { PluginPublisher } from "../services/plugin-publisher.service";
import { CapitalizeFirstPipe } from "../pipes/capitalizefirst/capitalizefirst.pipe";
import { ChangeScope } from "./change-scope-component/change-scope.component";
import { ChooseScope } from "./choose-scope-component/choose-scope.component";
import { HttpClientModule } from "@angular/common/http";
import { ErrorNotifyerComponent } from "./error-notifyer-component/error-notifyer.component";
import { VcdHttpTransferServiceModule } from "@vcd/http-transfer-service";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { PluginService } from "../services/plugin.service";

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        VcdSdkModule,
        VcdHttpTransferServiceModule
    ],
    declarations: [
        CapitalizeFirstPipe,
        StatusComponent,
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
    bootstrap: [],
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
export class LifecycleManagement { }

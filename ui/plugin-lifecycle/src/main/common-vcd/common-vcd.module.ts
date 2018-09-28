/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { VcdSdkModule } from "@vcd/sdk";
import { ClarityModule } from "clarity-angular";
import { ActionVerifierService } from "./action-verifier.service";
import { ActionVerifierComponent } from "./action-verifier-component/action-verifier.component";
import { LoadingIndicatorComponent } from "./loading-indicator-component/loading-indicator.component";
import { VcdAlert } from "./alert-component/alert.component";
import { ErrorNotifyerComponent } from "./error-notifyer-component/error-notifyer.component";

export * from "./action-verifier.service";

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        VcdSdkModule
    ],
    declarations: [
        ActionVerifierComponent,
        LoadingIndicatorComponent,
        VcdAlert,
        ErrorNotifyerComponent
    ],
    bootstrap: [],
    exports: [
        ActionVerifierComponent,
        LoadingIndicatorComponent,
        VcdAlert,
        ErrorNotifyerComponent
    ],
    providers: [ActionVerifierService]
})
export class CommonVcdModule {}

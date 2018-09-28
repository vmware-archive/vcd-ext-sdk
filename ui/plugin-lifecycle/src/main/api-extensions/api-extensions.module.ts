/*
 * Copyright 2018 VMware, Inc. All rights reserved. VMware Confidential
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { ClarityModule } from "clarity-angular";
import { ReactiveFormsModule } from "@angular/forms";
import { ApiExtensionsComponent } from "./api-extensions-component/api-extensions.component";
import { ApiExtensionService } from "../services/api-extension.service";
import { CommonVcdModule } from "../common-vcd/common-vcd.module";

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        ReactiveFormsModule,
        VcdSdkModule,
        CommonVcdModule
    ],
    declarations: [
        ApiExtensionsComponent
    ],
    bootstrap: [],
    exports: [],
    providers: [VcdApiClient, ApiExtensionService]
})
export class ApiExtensionsModule {}

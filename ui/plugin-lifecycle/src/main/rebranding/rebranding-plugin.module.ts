import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { ClarityModule } from "clarity-angular";
import { RebrandingComponent } from "./rebranding-component/rebranding.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ColorPickerModule } from "angular4-color-picker";
import { FormFieldComponent } from "./form-field-component/form-field.component";
import { RebrandingControlService } from "../services/rebranding-control.service";
import { TagListComponent } from "./tag-list-component/tag-list.component";
import { TagListService } from "../services/taglist.service";
import { RebrandingService } from "../services/rebranding.service";

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        ReactiveFormsModule,
        VcdSdkModule,
        ColorPickerModule
    ],
    declarations: [
        RebrandingComponent,
        TagListComponent,
        FormFieldComponent
    ],
    bootstrap: [],
    exports: [],
    providers: [VcdApiClient, RebrandingControlService, TagListService, RebrandingService]
})
export class RebrandingPluginModule {}

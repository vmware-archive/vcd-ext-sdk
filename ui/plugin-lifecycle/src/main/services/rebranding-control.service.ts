import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FieldBase } from "../classes/dynamic-fields/field-base";
import { Observable } from "rxjs";
import { RebrandingService } from "./rebranding.service";
import { TextField } from "../classes/dynamic-fields/text-field";
import { ColorPickerField } from "../classes/dynamic-fields/color-picker-field";
import { DropdwonField } from "../classes/dynamic-fields/dropdown-field";

@Injectable()
export class RebrandingControlService {
    constructor(
        private rebrandingService: RebrandingService
    ) { }

    public toFormGroup(fields: FieldBase<any>[]): FormGroup {
        const group: any = {};

        fields.forEach(field => {
            group[field.key] = field.validators.length > 0 ? new FormControl(field.value || "", field.validators)
                : new FormControl(field.value || "");
        });

        return new FormGroup(group);
    }

    public getFields(): Observable<FieldBase<any>[]> {
        return Observable.forkJoin(
            this.rebrandingService.getThemeData(),
            this.rebrandingService.getThemes()
        ).map((res) => {
            const [portalData, themes] = res;

            const fields: FieldBase<any>[] = [
                new TextField({
                    type: "text",
                    value: portalData.portalName,
                    key: "portalName",
                    label: "Portal Name",
                    validators: [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(24)
                    ],
                    order: 1,
                    errorMessage: "Portal name has to vary between 3 and 24 characters."
                }),
                /* new FileField({
                    type: "file",
                    value: "",
                    key: "logo",
                    label: "Portal Logo",
                    validators: [
                        fileType("png")
                    ],
                    order: 2,
                    errorMessage: "Logo has to be from png type and maximum 512KB."
                }), */
                new ColorPickerField({
                    type: "text",
                    value: portalData.portalColor,
                    key: "colorPicker",
                    label: "Portal color",
                    validators: [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(7)
                    ],
                    order: 3,
                    errorMessage: "Color is required."
                }),
                new DropdwonField({
                    key: "theme",
                    label: "Theme",
                    order: 4,
                    value: `${portalData.selectedTheme.themeType},${portalData.selectedTheme.name}`,
                    options: themes.map((el) => {
                        return { key: `${el.themeType},${el.name}`, value: el.name };
                    })
                }),
                /* new TagListField({
                    type: "hidden",
                    value: portalData.customLinks.toLocaleString(),
                    key: "customLinks",
                    label: "Custom Links",
                    order: 5
                }) */
            ];

            return fields;
        });
    }
}

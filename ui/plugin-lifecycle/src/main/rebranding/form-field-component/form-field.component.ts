import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldBase } from "../../classes/dynamic-fields/field-base";

@Component({
    selector: 'vcd-form-field',
    templateUrl: './form-field.component.html'
})
export class FormFieldComponent {
    @Input() field: FieldBase<any>;
    @Input() form: FormGroup;

    get isValid() { return this.form.controls[this.field.key].valid; }
}
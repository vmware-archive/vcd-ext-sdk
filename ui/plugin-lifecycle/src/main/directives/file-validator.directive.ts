import { AbstractControl, ValidatorFn } from '@angular/forms';

const fileTypes = new Map<string, RegExp>();
fileTypes.set("png", /.(png)$/);

/** A hero's name can't match the given regular expression */
export function fileType(fileType: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const forbidden = fileTypes.get(fileType).test(control.value);
        return forbidden ? null : { 'validatedFile': { value: control.value } };
    };
}
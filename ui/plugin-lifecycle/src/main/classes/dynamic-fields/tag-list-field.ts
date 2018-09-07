import { FieldBase, FieldBaseOptions } from "./field-base";

export class TagListField extends FieldBase<string> {
    controlType = 'taglist';
    type: string;

    constructor(options: FieldBaseOptions<string> = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}
import { FieldBase, FieldBaseOptions } from "./field-base";

export class DropdwonField extends FieldBase<string> {
    controlType = 'dropdown';
    options: { key: string, value: string }[] = [];
  
    constructor(options: FieldBaseOptions<string> = {}) {
      super(options);
      this.options = options['options'] || [];
    }
  }
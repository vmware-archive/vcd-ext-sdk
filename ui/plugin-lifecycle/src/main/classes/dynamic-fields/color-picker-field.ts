import { FieldBase, FieldBaseOptions } from './field-base';

export class ColorPickerField extends FieldBase<string> {
  controlType = 'colorPicker';
  type: string;

  constructor(options: FieldBaseOptions<string> = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
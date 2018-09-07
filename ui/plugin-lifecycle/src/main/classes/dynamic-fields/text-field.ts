import { FieldBase, FieldBaseOptions } from './field-base';

export class TextField extends FieldBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: FieldBaseOptions<string> = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
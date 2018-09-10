import { FieldBase, FieldBaseOptions } from './field-base';

export class FileField extends FieldBase<string> {
  controlType = 'filebox';
  type: string;

  constructor(options: FieldBaseOptions<string> = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
import { ValidatorFn } from '@angular/forms';

export interface FieldBaseOptions<T> {
  type?: string;
  value?: T,
  key?: string,
  label?: string,
  validators?: ValidatorFn[],
  order?: number,
  controlType?: string,
  options?: { key: string, value: string }[];
  errorMessage?: string;
}

export class FieldBase<T> {
  value: T;
  key: string;
  label: string;
  validators: ValidatorFn[];
  order: number;
  controlType: string;
  errorMessage: string;

  constructor(options: FieldBaseOptions<T> = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.validators = options.validators || [];
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.errorMessage = options.errorMessage || '';
  }
}
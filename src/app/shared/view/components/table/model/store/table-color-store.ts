export class TableColorStore {
  readonly fieldName: string;
  readonly fieldValue: string | number | boolean;
  readonly colorClassName: string;

  constructor(fieldName: string, fieldValue: string | number | boolean, colorClassName: string) {
    this.fieldName = fieldName;
    this.fieldValue = fieldValue;
    this.colorClassName = colorClassName;
  }
}

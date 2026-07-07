import {ABaseSearch} from './model/search/a-base-search';

export const DEFAULT_APP_NAME = 'APP.NAME';
export const DEFAULT_APP_VERSION = 'v.0.0.0';

export const DELAY_TIME_OPEN_FOR_TOOLTIP = 500;
export const DELAY_TIME_CLOSE_FOR_TOOLTIP = 70;
export const DELAY_TIME_SEARCH = 350;

export const DEFAULT_ND = 'Нет данных';
export const DEFAULT_NT = 'Не требуется';
export enum EmptyInputEnum {
  NT = 'NT',
  ND = 'ND'
}

export class SharedChecker {
  static isString(value: unknown): value is string {
    return typeof value === "string";
  }
  static isEmptyString(value: unknown): boolean {
    return this.isString(value) ? value.trim().length === 0 : false;
  }
  static isEmptyArray(value: unknown): boolean {
    return Array.isArray(value) ? value.length === 0 : false;
  }
  static isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
  }
  static isNumber(value: unknown): value is number {
    return typeof value === "number" && !isNaN(value);
  }
  static isNull(value: unknown): value is null {
    return value === null;
  }
  static isUndefined(value: unknown): value is undefined {
    return value === undefined;
  }
  static isNorU(value: unknown): boolean {
    return this.isNull(value) || this.isUndefined(value);
  }
  static isDate(value: unknown): value is Date {
    return value instanceof Date;
  }
  static isArray(value: unknown): value is any[] {
    return Array.isArray(value);
  }
  static isObject(value: unknown): value is Object {
    return typeof value === 'object' && !this.isNull(value);
  }
  //в объекте текущего фильтра не должно быть полей, которых нет в новом фильтре!
  static isEqualForFilter(currentFilter: ABaseSearch, newFilter: ABaseSearch): boolean {
    const keyList = Object.keys(currentFilter);
    for(const key of keyList) {
      const currentValue = currentFilter[key as keyof ABaseSearch];
      const newValue = newFilter[key as keyof ABaseSearch];
      if (!this.isEqual(currentValue, newValue)) return false;
    }
    return true;
  }
  static isEqual(value1: any, value2: any): boolean {
    const value1IsEmpty = SharedChecker.isNull(value1) || SharedChecker.isUndefined(value1);
    const value2IsEmpty = SharedChecker.isNull(value2) || SharedChecker.isUndefined(value2);

    if (value1IsEmpty && value2IsEmpty) return true;//если оба пустые
    if (value1IsEmpty !== value2IsEmpty) return false;//если один пустой

    if (this.isString(value1) && this.isString(value2))//если оба строки
      return value1.trim() === value2.trim();

    if((this.isArray(value1) && this.isArray(value2)) || //если оба массивы или оба объекты
      (this.isObject(value1) && this.isObject(value2)))
      return JSON.stringify(value1) === JSON.stringify(value2);

    return value1 === value2;//примитивные значения
  }
}

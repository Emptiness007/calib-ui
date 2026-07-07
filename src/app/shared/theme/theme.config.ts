export class ThemeConfig {
  //получение имени ключа через значение (работает с string и number)
  static getEnumKeyFromValue<T>(enumObject: T, value: any): keyof T {
    for (const key in enumObject) {
      if (enumObject[key] === value) {
        return key;
      }
    }
    return value;
  }
}
export enum ThemeEnum {
  LIGHT = 'light',
  STANDARD = 'standard',
  DARK = 'dark'
}
export enum ThemeIconEnum {
  LIGHT = 'sun',
  STANDARD = 'palette',
  DARK = 'moon-stars'
}
export const DEFAULT_THEME = ThemeEnum.STANDARD;
//за счет привязки через функцию, при добавлении значения в ThemeEnum обязательно попросит добавить такое же значение в ThemeIconEnum
export const DEFAULT_THEME_ICON = ThemeIconEnum[ThemeConfig.getEnumKeyFromValue(ThemeEnum, DEFAULT_THEME)];



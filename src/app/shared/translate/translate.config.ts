import {HttpBackend} from '@angular/common/http';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  Translation
} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {environment} from '../../../environments/environment';

//класс для создания текста с переводом из файла
export class TextT {
  constructor(keyForTranslate: string, value: any = null) {
    this.key = keyForTranslate.toUpperCase();
    this.value = value;
  }
  key: string;//ключ для перевода
  value: any;//значение, передаваемое в перевод
}
export enum LanguageEnum {
  EN = 'en',
  RU = 'ru'
}
export const DEFAULT_LANGUAGE = LanguageEnum.RU;
export const TRANSLATION_RESOURCES = [
  { prefix: '/public/i18n/' },
  { prefix: environment.production ? '../translate/' : '/public/shared/i18n/' }
];
//используем фабрику для создания переводов из нескольких файлов
export const httpLoaderFactory: (http: HttpBackend) => MultiTranslateHttpLoader = (http) =>
  new MultiTranslateHttpLoader(http, TRANSLATION_RESOURCES);

//todo можно сделать свои собственные сообщения об отсутствующих переводах
//вызываем уведомление браузера, если это не продакшн и если нет перевода для статического ключа
export class ReMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): Translation | Observable<Translation> {
    if (!environment.production) alert(`Внимание!: перевод для ${params.key} на языке ${params.translateService.getCurrentLang()} отсутствует...`);
    return params.key;
  }
}


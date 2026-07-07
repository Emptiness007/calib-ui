import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DEFAULT_LANGUAGE, LanguageEnum} from '../translate/translate.config';

@Injectable({
  providedIn: 'root',
})
export class ClockService {
  private currentTime$ = new BehaviorSubject(this.getFormatedCurrentTime(DEFAULT_LANGUAGE));
  getCurrentTime() {
    return this.currentTime$.asObservable();
  }
  getCurrentTimeValue() {
    return this.currentTime$.value;
  }
  setCurrentTime(localeLanguage: LanguageEnum) {
    this.currentTime$.next(this.getFormatedCurrentTime(localeLanguage));
  }
  //получить текущие дату и время в нужном виде
  private getFormatedCurrentTime(localeLanguage: LanguageEnum) {
    return new Date().toLocaleTimeString(localeLanguage, {day:'2-digit', month:'short', hour: '2-digit', minute: '2-digit'});
  }
}

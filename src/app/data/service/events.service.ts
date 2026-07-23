import {inject, Injectable} from '@angular/core';
import {SharedEventsService} from '../../shared/service/shared-events.service';
import {UserStore} from '../../shared/auth/model/store/user-store';
import {ThemeEnum} from '../../shared/theme/theme.config';
import {LanguageEnum, TextT} from '../../shared/translate/translate.config';
import {RoleStore} from '../../shared/auth/model/store/role-store';
import {NewsStore} from '../../shared/view/dialogs/news-dialog/model/store/news-store';
import {BehaviorSubject} from 'rxjs';
import {StepInputData} from '../model/step-input-data';
import {StepResultData} from '../model/step-result-data';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private seService = inject(SharedEventsService);

  //текущий пользователь
  setCurrentUser(user: UserStore) {
    this.seService.setCurrentUser(user);
  }
  getCurrentUser() {
    return this.seService.getCurrentUser();
  }

  //текущая тема
  setCurrentAppTheme(theme: ThemeEnum) {
    this.seService.setCurrentAppTheme(theme);
  }
  getCurrentAppTheme(){
    return this.seService.getCurrentAppTheme();
  }

  //текущий язык сайта
  setCurrentLanguage(language: LanguageEnum) {
    this.seService.setCurrentLanguage(language);
  }
  getCurrentLanguage() {
    return this.seService.getCurrentLanguage();
  }

  //версия сайта для пользователя
  setUserAppVersion(version: string) {
    this.seService.setUserAppVersion(version);
  }
  getUserAppVersion(){
    return this.seService.getUserAppVersion();
  }

  //текущая версия сайта
  setCurrentAppVersion(version: string) {
    this.seService.setCurrentAppVersion(version);
  }
  getCurrentAppVersion(){
    return this.seService.getCurrentAppVersion();
  }

  //текущая роль
  setCurrentRole(role: RoleStore) {
    this.seService.setCurrentRole(role);
  }
  getCurrentRole() {
    return this.seService.getCurrentRole();
  }

  //флаг сброса локального хранилища текущего пользователя
  setFlagResetLS(flag: boolean = true) {
    this.seService.setFlagResetLS(flag);
  }
  getFlagResetLS() {
    return this.seService.getFlagResetLS();
  }

  //флаг выхода из приложения
  setFlagExitApp(flag: boolean = true) {
    this.seService.setFlagExitApp(flag);
  }
  getFlagExitApp() {
    return this.seService.getFlagExitApp();
  }

  //флаг выхода пользователя из платформы
  setFlagChangeUser(flag: boolean = true) {
    this.seService.setFlagChangeUser(flag);
  }
  getFlagChangeUser() {
    return this.seService.getFlagChangeUser();
  }

  //наименование приложения
  setAppName(name: TextT | string) {
    this.seService.setAppName(name);
  }
  getAppName(){
    return this.seService.getAppName();
  }

  //новости приложения
  setNews(news: NewsStore[]){
    this.seService.setNews(news);
  }
  getNews(){
    return this.seService.getNews();
  }

  //входные данные для изделия
  private stepData$ = new BehaviorSubject<StepInputData[]>([]);
  setStepData(data: StepInputData[]){
    this.stepData$.next(data);
  }
  getStepData(){
    return this.stepData$.asObservable();
  }

  //результаты вычислений для изделия
  private resultData$ = new BehaviorSubject<StepResultData[]>([]);
  setResultData(result: StepResultData[]){
    this.resultData$.next(result);
  }
  getResultData(){
    return this.resultData$.asObservable();
  }

}

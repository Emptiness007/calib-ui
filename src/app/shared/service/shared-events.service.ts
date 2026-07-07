import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ThemeEnum} from '../theme/theme.config';
import {LanguageEnum, TextT} from '../translate/translate.config';
import {UserStore} from '../auth/model/store/user-store';
import {RoleStore} from '../auth/model/store/role-store';
import {DEFAULT_APP_NAME} from '../shared-constant.config';
import {InstructionStore} from '../model/store/instruction-store';
import {NewsStore} from '../view/dialogs/news-dialog/model/store/news-store';

@Injectable({
  providedIn: 'root'
})
export class SharedEventsService {
  //текущий пользователь
  private currentUser$ = new BehaviorSubject<UserStore | null>(null);
  setCurrentUser(user: UserStore) {
    this.currentUser$.next(user);
  }
  getCurrentUser() {
    return this.currentUser$.asObservable();
  }
  //тема приложения
  private currentAppTheme$ = new BehaviorSubject<ThemeEnum | null>(null);
  setCurrentAppTheme(theme: ThemeEnum) {
    this.currentAppTheme$.next(theme);
  }
  getCurrentAppTheme(){
    return this.currentAppTheme$.asObservable();
  }
  //язык приложения
  private currentLanguage$ = new BehaviorSubject<LanguageEnum | null>(null);
  setCurrentLanguage(language: LanguageEnum) {
    this.currentLanguage$.next(language);
  }
  getCurrentLanguage() {
    return this.currentLanguage$.asObservable();
  }
  //наименование приложения
  private appName$ = new BehaviorSubject<TextT | string>(new TextT(DEFAULT_APP_NAME));
  setAppName(name: TextT | string) {
    this.appName$.next(name);
  }
  getAppName(){
    return this.appName$.asObservable();
  }
  //версия приложения для пользователя
  private userAppVersion$ = new BehaviorSubject<string | null>(null);
  setUserAppVersion(version: string) {
    this.userAppVersion$.next(version);
  }
  getUserAppVersion(){
    return this.userAppVersion$.asObservable();
  }
  //текущая версия приложения
  private currentAppVersion$ = new BehaviorSubject<string | null>(null);
  setCurrentAppVersion(version: string) {
    this.currentAppVersion$.next(version);
  }
  getCurrentAppVersion(){
    return this.currentAppVersion$.asObservable();
  }
  //выбранная роль у пользователя
  private currentRole$ = new BehaviorSubject<RoleStore | null>(null);
  setCurrentRole(role: RoleStore) {
    this.currentRole$.next(role);
  }
  getCurrentRole() {
    return this.currentRole$.asObservable();
  }
  //активна ли вкладка с нашим ПО
  private appTabVisibility$ = new BehaviorSubject(document.visibilityState)
  setAppTabVisibility(visibilityState: DocumentVisibilityState) {
    this.appTabVisibility$.next(visibilityState);
  }
  getAppTabVisibility() {
    return this.appTabVisibility$.asObservable();
  }
  //удаление записи текущего пользователя из локального хранилища
  private flagResetLS$ = new BehaviorSubject<boolean>(false);//сброс куков
  setFlagResetLS(flag: boolean = true) {
    this.flagResetLS$.next(flag);
  }
  getFlagResetLS() {
    return this.flagResetLS$.asObservable();
  }
  //выйти из приложения
  private flagExitApp$ = new BehaviorSubject<boolean>(false);
  setFlagExitApp(flag: boolean = true) {
    this.flagExitApp$.next(flag);
  }
  getFlagExitApp() {
    return this.flagExitApp$.asObservable();
  }
  //смена пользователя
  private flagChangeUser$ = new BehaviorSubject<boolean>(false);
  setFlagChangeUser(flag: boolean = true) {
    this.flagChangeUser$.next(flag);
  }
  getFlagChangeUser() {
    return this.flagChangeUser$.asObservable();
  }
  //закрыли окно настроек
  private flagCloseSettings$ = new BehaviorSubject<boolean>(false);
  setFlagCloseSettings(flag: boolean = true) {
    this.flagCloseSettings$.next(flag);
  }
  getFlagCloseSettings() {
    return this.flagCloseSettings$.asObservable();
  }
  //наименование вкладки для инструкции
  private instruction$ = new BehaviorSubject<InstructionStore | null>(null);
  setInstruction(instruction: InstructionStore) {
    this.instruction$.next(instruction);
  }
  getInstruction(){
    return this.instruction$.asObservable();
  }
  //новости приложения
  private news$ = new BehaviorSubject<NewsStore[]>([]);
  setNews(news: NewsStore[]){
    this.news$.next(news);
  }
  getNews(){
    return this.news$.asObservable();
  }
}

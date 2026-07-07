import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DEFAULT_LANGUAGE, LanguageEnum} from './shared/translate/translate.config';
import {environment} from '../environments/environment';
import {LS_APP_NAME, LS_APP_NAME_TEST} from './app.constant.config';
import {
  ID_UNDEFINED,
  ROLE_UNDEFINED,
  USER_DEVELOPMENT,
  USER_PRODUCTION,
  USER_UNDEFINED
} from './shared/auth/auth.config';
import {LocalStorageService} from './shared/local-storage/local-storage.service';
import {LocalStorageEnum} from './shared/local-storage/local-storage.config';
import {DEFAULT_THEME} from './shared/theme/theme.config';
import {EventsService} from './data/service/events.service';
import {DEFAULT_APP_VERSION} from './shared/shared-constant.config';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthService} from './shared/auth/auth.service';
import {ThemeService} from './shared/theme/theme.service';
import {NewsStore} from './shared/view/dialogs/news-dialog/model/store/news-store';
import {Spinner} from './shared/view/components/spinner/spinner/spinner';
import {NotificationList} from './shared/view/components/notifications/notification-list/notification-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslatePipe, Spinner, NotificationList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  private readonly authService = inject(AuthService);
  private readonly eService = inject(EventsService);
  private readonly lsService = inject(LocalStorageService);
  private readonly themeService = inject(ThemeService);
  private readonly tService = inject(TranslateService);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  protected cookieEnabled = false;
  private currentUser = USER_UNDEFINED;
  private lSName = this.getLSName();

  ngOnInit() {
    this.initTranslate();
    if(!this.cookieIsActive()) return;
    this.initUserAndLocalStorage();
    this.initNews();
  }

  //инициализация переводов
  initTranslate(): void {
    this.tService.addLangs(Object.values(LanguageEnum));
    this.tService.setFallbackLang(DEFAULT_LANGUAGE);
    this.tService.use(DEFAULT_LANGUAGE);
  }
  //проверяем включены ли cookie (они нужны для jwt-токена)
  cookieIsActive() {
    this.cookieEnabled = navigator.cookieEnabled;
    return this.cookieEnabled;
  }
  //получение пользователя и работа с LS
  initUserAndLocalStorage(): void{
    this.authService.getUserAuthorized()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe( user => {
        if (environment.auth) {
          user.id === ID_UNDEFINED ? this.authService.openPlatformPage() : this.currentUser = user;
        }
        else {
          environment.production ? this.currentUser = USER_PRODUCTION : this.currentUser = USER_DEVELOPMENT;
        }
        //формируем ключ для локального хранилища данных о действиях пользователя в данном ПО
        this.lSName = this.getLSName();

        this.initLSValues();

        this.eService.setCurrentUser(this.currentUser);

        //куча подписок на разные вещи
        this._changeTheme();
        this._changeLanguage();
        this._getUserAppVersion();
        this._changeRole();
        this._resetLS();
        this._exitApp();
        this._changeUser();
      });
  }
  //получение имени локального хранилища
  getLSName() {
    return (environment.test ? LS_APP_NAME_TEST : LS_APP_NAME) + ':' + this.currentUser.lsName;
  }
  //подписка на смену темы
  _changeTheme(): void{
    this.eService.getCurrentAppTheme()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe( theme => {
        if (theme) {
          this.themeService.changeTheme(theme);
          this.lsService.addPropertyLS(this.lSName, LocalStorageEnum.APP_THEME, theme);
        }
      });
  }
  //подписка на смену языка
  _changeLanguage() {
    this.eService.getCurrentLanguage()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(language => {
        if (language) {
          this.tService.use(language);
          this.lsService.addPropertyLS(this.lSName!, LocalStorageEnum.APP_LANGUAGE, language);
        }
      });
  }
  //подписка на версию приложения
  _getUserAppVersion() {
    this.eService.getUserAppVersion()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(version => {
        if (version)
          this.lsService.addPropertyLS(this.lSName!, LocalStorageEnum.APP_VERSION, version);
      });
  }
  //подписка на смену роли
  _changeRole() {
    this.eService.getCurrentRole()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(role => {
        if (role) {
          this.lsService.addPropertyLS(this.lSName!, LocalStorageEnum.USER_ROLE, role.name);
        }
      });
  }
  //подписка на сброс локал сториджа
  _resetLS() {
    this.eService.getFlagResetLS()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(flagResetLS => {
        if (flagResetLS) {
          this.lsService.deleteLS(this.lSName!);
          this.initLSValues();
          this.eService.setFlagResetLS(false);
        }
      });
  }
  //подписка на выход из приложения
  _exitApp() {
    this.eService.getFlagExitApp()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(flagExitApp => {
        if (flagExitApp) {
          this.authService.openPlatformPage();
          this.eService.setFlagExitApp(false);
        }
      });
  }
  //подписка на смену пользователя
  _changeUser() {
    this.eService.getFlagChangeUser()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(flagChangeUser => {
        if (flagChangeUser) {
          this.authService.logout();
        }
      });
  }

  //чтение переменных из локального хранилища
  initLSValues() {
    let lsPropertyParse: any = this.lsService.getLS(this.lSName);
    if (!lsPropertyParse) lsPropertyParse = {};

    //инициализация темы приложения
    const themeLS = lsPropertyParse[LocalStorageEnum.APP_THEME];
    const theme = themeLS ? themeLS : DEFAULT_THEME;
    this.eService.setCurrentAppTheme(theme);

    //инициализация языка приложения
    const languageLS = lsPropertyParse[LocalStorageEnum.APP_LANGUAGE];
    const language = languageLS ? languageLS : DEFAULT_LANGUAGE;
    this.eService.setCurrentLanguage(language);

    //инициализация версии ПО приложения (для колокольчика уведомлений о нововведениях)
    const appVersionLS = lsPropertyParse[LocalStorageEnum.APP_VERSION];
    const appVersion = appVersionLS ? appVersionLS : DEFAULT_APP_VERSION;
    this.eService.setUserAppVersion(appVersion);

    //инициализация начальной роли пользователя приложения
    const userRoleLS = lsPropertyParse[LocalStorageEnum.USER_ROLE];
    let userRole;
    if (!this.currentUser.roleSetForApp || this.currentUser.roleSetForApp.length == 0)
      userRole = ROLE_UNDEFINED;
    else {
      const userRoleTmp = this.currentUser.roleSetForApp.find(role => role.name === userRoleLS);
      userRole = userRoleTmp ? userRoleTmp : this.currentUser.roleSetForApp[0];
    }
    this.eService.setCurrentRole(userRole);
  }


  private initNews(){
    const news: NewsStore[] = [
      new NewsStore('v.0.0.1', new Date(2026, 4, 1), ['Начало разработки приложения'])
    ];
    this.eService.setNews(news);
  }
}

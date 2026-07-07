import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {AUTH_URL_TOKEN, AuthLoginUrlEnum, LOGIN_URL_TOKEN, USER_UNDEFINED} from './auth.config';
import {HttpClient} from '@angular/common/http';
import {UserStore} from './model/store/user-store';
import {environment} from '../../../environments/environment';
import {plainToInstance} from 'class-transformer';
import {UserDTO} from './model/dto/user-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = inject(AUTH_URL_TOKEN);
  private readonly loginUrl = inject(LOGIN_URL_TOKEN);
  private readonly httpClient =  inject(HttpClient);

  readonly authIsNeeded = environment.auth;//нужна ли авторизация пользователя

  private flagUserAuthorization$ = new BehaviorSubject(false);//авторизован ли пользователь
  setFlagUserAuthorization(flag: boolean) {
    this.flagUserAuthorization$.next(flag);
  }
  getFlagUserAuthorizationValue() {
    return this.flagUserAuthorization$.value;
  }

  private userAuthorized$ = new BehaviorSubject(USER_UNDEFINED);//авторизованный пользователь
  setUserAuthorized(user: UserStore): void{
    this.userAuthorized$.next(user);
  }
  getUserAuthorized(){
    return this.userAuthorized$.asObservable();//наблюдаемый объект для подписки
  }
  getUserAuthorizedValue(){
    return this.userAuthorized$.value;//разовое значение без подписки
  }

  // авто логин пользователя (если есть в куках JWT, то от бекенда вернется статус 200 и текущий пользователь)
  autoLogin(): Observable<UserStore> {
    return this.httpClient.post<UserDTO>(this.authUrl + AuthLoginUrlEnum.AUTO, null)
      .pipe(map(userDTO => plainToInstance(UserStore, userDTO)));//todo проверить при включенной авторизации
  }
  //открыть страницу платформы в текущей вкладке
  openPlatformPage(): void {
    window.location.href = this.loginUrl + AuthLoginUrlEnum.USER_MAIN;
  }
  //открыть страницу авторизации на платформе в текущей вкладке
  openLoginPlatformPage(): void {
    window.location.href = this.loginUrl;
  }
  //выход из приложения
  logout(): void {
    //Чтобы удалить кук с флагом httpOnly необходимо попросить об этом сервер, т.к. клиент не имеет доступ к куку
    this.httpClient.post<any>(this.authUrl + AuthLoginUrlEnum.LOGOUT, null)
      .subscribe({
        next: _result => {
          this.setUserAuthorized(USER_UNDEFINED); //сброс пользователя до стандартного
          this.setFlagUserAuthorization(false); //указываем что пользователь разлогинился
          this.openLoginPlatformPage(); //переходим на страницу авторизации на платформе
        },
        error: error => {
          console.log(error);//todo может выдавать какое-то полноценное сообщение, а не только в лог писать?
        }
      });
  }
}

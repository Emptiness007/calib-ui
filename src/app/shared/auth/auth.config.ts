import {UserStore} from './model/store/user-store';
import {RoleStore} from './model/store/role-store';
import {InjectionToken} from '@angular/core';
import {environment} from '../../../environments/environment';

//TODO узнать какие роли будут и полностью поменять файл

export const AUTH_URL_TOKEN = new InjectionToken<string>('url auth', {
  providedIn: 'root',
  factory: () => environment.authURL + AUTH_CONTROLLER_URL
})

export const LOGIN_URL_TOKEN = new InjectionToken<string>('url login', {
  providedIn: 'root',
  factory: () => environment.loginUrl + '/'
})
export const AUTH_CONTROLLER_URL = '/auth/'
//enum с частью url адреса для авторизации и логина
export enum AuthLoginUrlEnum {
  AUTO = 'auto',
  LOGOUT = 'logout',
  USER_MAIN = 'user-main'
}


export enum UserRoleAppEnum {
  MAINTAINER = 'FILESTORAGE_MAINTAINER', //разработчик - он просто бог
  VIEW = 'FILESTORAGE_VIEW', //просмотр
  NONE = 'NONE_ROLE'
}
//магические ID пользователей
export const ID_UNDEFINED = 999999999;//для отсутствующего пользователь
export const ID_PRODUCTION = 888888888;//для пользователя при тестировании
export const ID_DEVELOPMENT = 777777777;//для разработчика

const ROLE_MAINTAINER = new RoleStore(1, UserRoleAppEnum.MAINTAINER, "Файловое хранилище: Разработчик");
const ROLE_VIEW = new RoleStore(8, UserRoleAppEnum.VIEW, "Файловое хранилище: Просмотр");

//инициализация отсутствующей роли
export const ROLE_UNDEFINED = new RoleStore(ID_UNDEFINED, UserRoleAppEnum.NONE, 'Роль у пользователя не найдена');
//инициализация отсутствующего пользователя
export const USER_UNDEFINED = new UserStore(ID_UNDEFINED, 'Пользователь', 'отсутствует', '', [ROLE_UNDEFINED]);

//инициализация пользователя-разработчика, если выключена авторизация (со всеми доступными ролями)
export const USER_DEVELOPMENT = new UserStore(ID_DEVELOPMENT, 'Разработчик', 'Приложения', '',
  [ROLE_MAINTAINER, ROLE_VIEW]);

export const USER_PRODUCTION = new UserStore(ID_PRODUCTION, 'Некий', 'Тестовый', 'Пользователь',
  [ ROLE_VIEW]);

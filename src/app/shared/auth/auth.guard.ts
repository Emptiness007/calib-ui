import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {RoleStore} from './model/store/role-store';
import {catchError, first, map, of} from 'rxjs';

//проверка авторизации пользователя и нужных ролей при переходе по-указанному в app.routes маршруту
export const authAndRoleGuard: CanActivateFn = (route, _state) => {
  //route - параметры, указанные в app.routes, где используется authGuard, при проверке перехода по заданному url
  const authService = inject(AuthService);
  //проверяем необходимость проверки авторизации, если работа ПО без авторизации, то сразу пропускаем на нужный адрес
  if (!authService.authIsNeeded) return true;

  // проверяем авторизацию пользователя
  if (authService.getFlagUserAuthorizationValue()) {//если пользователь авторизован, то проверяем наличие разрешенной роли
    const user = authService.getUserAuthorizedValue();
    return userHasRequiredRole(user.roleSetForApp, route.data['allowedRoleList']);
  }
  // Пытаемся провести автоматическую авторизацию пользователя.
  // Если авторизация была произведена ранее, то в cookie сохранился jwt-токен.
  // Этот токен будет отправлен на backend и пользователь автоматически авторизуется.
  // В ответ получаем данные пользователя и проверяем наличие разрешенной роли.
  // Если пользователь не авторизован, то направляем на страницу "Доступ запрещен".
  return authService.autoLogin()
    .pipe(
      first(),
      map(user => {
        if (user) {
          authService.setUserAuthorized(user);
          authService.setFlagUserAuthorization(true);
          return userHasRequiredRole(user.roleSetForApp, route.data['allowedRoleList']);
        }
        else {
          authService.openLoginPlatformPage();
          return false;
        }
      }),
      catchError(error => {
        console.log(error);//todo может выдавать какое-то полноценное сообщение, а не только в лог писать?
        authService.openLoginPlatformPage();
        return of(false);
      })
    );
};

//Проверяем наличие у пользователя нужной роли для перехода
export function userHasRequiredRole(userRoleList: RoleStore[], allowedRoleList: string[]) {
  const routerService = inject(Router);
  for (const allowedRole of allowedRoleList) {
    if (userRoleList.find((userRole: RoleStore)  => userRole.name === allowedRole)) {
      return true; // если совпала хотя бы одна найденная запись
    }
  }
  return routerService.createUrlTree(['/access-denied']); // если нет доступа, то перенаправляем на страницу access-denied
}

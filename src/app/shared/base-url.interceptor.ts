import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AUTH_CONTROLLER_URL} from './auth/auth.config';

export const baseUrlInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  let newReq = req.clone();
  if (!req.url.includes(AUTH_CONTROLLER_URL)) {
    newReq = req.clone({
      url: environment.backendURL + req.url
    });
  }
  return next(newReq);
};

import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {finalize} from 'rxjs';
import {SpinnerService} from './spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const sService = inject(SpinnerService);
  sService.showSpinner();
  return next(req)
    .pipe(
      finalize(() => {
        sService.hideSpinner();
      })
    );
};

//еще можно сделать список url адресов, при запросе на которые не будет задействован индикатор загрузки (спиннер)
// if (this.shouldExclude(req.url)) {
//   return next(req);
// }
// private readonly excludeUrls = ['/api/heartbeat', '/api/status'];
// private shouldExclude(url: string): boolean {
//   return this.excludeUrls.some(excluded => url.includes(excluded));
// }

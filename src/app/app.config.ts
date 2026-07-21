import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HttpBackend, provideHttpClient, withInterceptors} from '@angular/common/http';
import {baseUrlInterceptor} from './shared/base-url.interceptor';
import {spinnerInterceptor} from './shared/view/components/spinner/spinner.interceptor';
import {DEFAULT_LANGUAGE, httpLoaderFactory, ReMissingTranslationHandler} from './shared/translate/translate.config';
import {MissingTranslationHandler, provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {environment} from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([baseUrlInterceptor, spinnerInterceptor])
    ),
    provideTranslateService({
      lang:  DEFAULT_LANGUAGE,
      fallbackLang: environment.production ? DEFAULT_LANGUAGE : undefined,
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps:[HttpBackend]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: ReMissingTranslationHandler
      }
    })
  ]
};

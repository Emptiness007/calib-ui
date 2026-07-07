import {inject, Injectable} from '@angular/core';
import {of} from 'rxjs';
import {TextT} from './translate.config';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SharedTranslateService {
  private readonly tService = inject(TranslateService);
  getTranslateText(text: TextT | string) {
    if (text instanceof TextT) {
      return this.tService.stream(text.key, {value: text.value});
    }
    else {
      return of(text);
    }
  }
}

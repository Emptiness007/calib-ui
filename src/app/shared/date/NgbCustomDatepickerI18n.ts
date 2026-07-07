import {DestroyRef, inject, Injectable} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {SharedEventsService} from '../service/shared-events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DEFAULT_LANGUAGE, LanguageEnum} from '../translate/translate.config';

const I18N_DATE = {
  ru: {
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Нояб.', 'Дек.'],
    monthsFull: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сен.', 'Окт.', 'Нояб.', 'Дек.'],
  },
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    monthsFull: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  }
};

@Injectable()
export class NgbCustomDatepickerI18n extends NgbDatepickerI18n {
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);
  private readonly seService = inject(SharedEventsService);
  private currentLanguage: LanguageEnum = DEFAULT_LANGUAGE;


  constructor() {
    super();
    this.initLanguage();
  }

  private initLanguage() {
    this.seService.getCurrentLanguage()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentLanguage => {
      this.currentLanguage = currentLanguage ? currentLanguage : DEFAULT_LANGUAGE;
    });
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}.${date.month}.${date.year}`;
  }
  getWeekdayLabel(weekday: number): string {
    return I18N_DATE[this.currentLanguage].weekdays[weekday - 1];
  }
  getMonthShortName(month: number, year?: number): string {
    return I18N_DATE[this.currentLanguage].months[month - 1];
  }
  getMonthFullName(month: number, year?: number): string {
    return I18N_DATE[this.currentLanguage].monthsFull[month - 1];
  }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HolidayEnum} from './holiday.config';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private currentHoliday$ = new BehaviorSubject(HolidayEnum.NONE);
  //инициализируем праздник
  private initCurrentHoliday() {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;

    switch (month) {
      case 1: {
        //новый год
        if (this.isInRange(day, 1, 31)) this.currentHoliday$.next(HolidayEnum.NEW_YEAR);
        break;
      }
      case 2: {
        //день защитника отечества
        if (this.isInRange(day, 16, 29)) this.currentHoliday$.next(HolidayEnum.DEFENDER_OF_THE_FATHERLAND_DAY);
        break;
      }
      case 3: {
        //международный женский день
        if (this.isInRange(day, 1, 15)) this.currentHoliday$.next(HolidayEnum.INTERNATIONAL_WOMENS_DAY);
        break;
      }
      case 5: {
        //день победы
        if (this.isInRange(day, 5, 9)) this.currentHoliday$.next(HolidayEnum.VICTORY_DAY);
        break;
      }
      case 6: {
        //день России
        if (this.isInRange(day, 8, 12)) this.currentHoliday$.next(HolidayEnum.DAY_OF_RUSSIA);
        break;
      }
      case 12: {
        //новый год
        if (this.isInRange(day, 1, 31)) this.currentHoliday$.next(HolidayEnum.NEW_YEAR);
        //день авиадвигателя
        if (this.isInRange(day, 7, 11)) this.currentHoliday$.next(HolidayEnum.DAY_OF_AVID);
        break;
      }
      default: {
        this.currentHoliday$.next(HolidayEnum.NONE);
      }
    }
  }
  //проверяем входит ли текущий день в диапазон отображения праздничной атмосферы
  private isInRange(day: number, min: number, max: number): boolean {
    return day >= min && day <= max;
  }

  setCurrentHoliday(holiday: HolidayEnum) {
    this.currentHoliday$.next(holiday);
  }
  getCurrentHoliday() {
    this.initCurrentHoliday();
    return this.currentHoliday$.asObservable();
  }
  getCurrentHolidayValue() {
    this.initCurrentHoliday();
    return this.currentHoliday$.value;
  }
}

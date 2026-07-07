import { Injectable } from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged} from 'rxjs';
import {DELAY_TIME_STATUS} from './spinner.config';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private loadingCount = 0;
  private loading$ = new BehaviorSubject(false);
  //показать индикатор загрузки
  showSpinner() {
    this.loadingCount++;
    this.loading$.next(true);
  }
  //скрыть индикатор загрузки
  hideSpinner() {
    if (this.loadingCount > 0) this.loadingCount--;
    if (this.loadingCount === 0) this.loading$.next(false);
  }
  //сбросить все индикаторы загрузки
  resetSpinner() {
    this.loadingCount = 0;
    this.loading$.next(false);
  }
  //получить текущее состояние загрузки
  isLoadingSpinner() {
    return this.loading$.asObservable().pipe(debounceTime(DELAY_TIME_STATUS), distinctUntilChanged());
  }
}

import {ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal} from '@angular/core';
import {ClockService} from '../clock.service';
import {interval, Subscription} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TimeEnum} from '../clock.config';
import {SharedEventsService} from '../../service/shared-events.service';
import {DEFAULT_LANGUAGE, LanguageEnum} from '../../translate/translate.config';

@Component({
  selector: 'app-shared-clock',
  imports: [],
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'(click)': 'onClickClock()'}
})
export class Clock {
  private readonly clockService = inject(ClockService);
  private readonly seService = inject(SharedEventsService);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  protected currentTime = signal<string[]>(this.clockService.getCurrentTimeValue().split(':'));
  protected currentLanguage = signal(DEFAULT_LANGUAGE);
  protected isBlinking = signal(true);
  private clockIntervalTime = signal<number | null>(null);
  private clockIntervalTimeSubscription?: Subscription;

  constructor() {
    effect(() => {
      this.changeIntervalTimeForClock(this.clockIntervalTime(), this.currentLanguage());
    });
    this._changeAppTabVisibility();
    this._getCurrentLanguage();
    this._getCurrentTime();
  }
  //подписка отслеживания активности вкладки с ПО
  _changeAppTabVisibility() {
    this.seService.getAppTabVisibility()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(visibilityState => {
        if (visibilityState == 'visible') {
          this.clockIntervalTime.set(TimeEnum.MINUTE - new Date().getUTCSeconds() * TimeEnum.SECOND);
        } else {
          this.clockIntervalTime.set(null);
        }
      });
  }
  //подписка на получение текущего времени
  _getCurrentLanguage() {
    this.seService.getCurrentLanguage()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentLanguage => {
        if (currentLanguage) this.currentLanguage.set(currentLanguage);
      });
  }
  //подписка на получение текущего времени
  _getCurrentTime() {
    this.clockService.getCurrentTime()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentTime => {
        const currentTimeSplit = currentTime.split(':');
        this.currentTime.set(currentTimeSplit);
      });
  }
  //изменить интервал обновления часов
  changeIntervalTimeForClock(intervalTime: number | null, localeLanguage: LanguageEnum) {
    if (this.clockIntervalTimeSubscription) {
      this.clockIntervalTimeSubscription.unsubscribe();
      this.clockIntervalTimeSubscription = undefined;
    }
    this.clockService.setCurrentTime(localeLanguage);
    if (!intervalTime) return;

    this.clockIntervalTimeSubscription = interval(intervalTime)
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe( () => {
        this.clockService.setCurrentTime(localeLanguage);
        if (intervalTime != TimeEnum.MINUTE) this.clockIntervalTime.set(TimeEnum.MINUTE);
      });
  }
  //по нажатия на часы меняем мигание двоеточия
  onClickClock() {
    this.isBlinking.set(!this.isBlinking());
  }
}

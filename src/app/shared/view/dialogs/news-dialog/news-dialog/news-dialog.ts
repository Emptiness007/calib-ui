import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SharedEventsService} from '../../../../service/shared-events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {LanguageEnum} from '../../../../translate/translate.config';
import {TranslatePipe} from '@ngx-translate/core';
import {NewsStore} from '../model/store/news-store';

@Component({
  selector: 'app-news-dialog',
  imports: [
    TranslatePipe
  ],
  templateUrl: './news-dialog.html',
  styleUrl: './news-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsDialog {
  private readonly activeModal = inject(NgbActiveModal)
  private readonly seService = inject(SharedEventsService);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  protected readonly currentAppVersion = signal<string | null>(null);
  protected readonly userAppVersion = signal<string | null>(null);
  protected readonly currentLanguage = signal<LanguageEnum>(LanguageEnum.RU);
  protected readonly allNews = signal<NewsStore[]>([]);

  constructor() {
    this._getCurrentAppVersion();
    this._getUserAppVersion();
    this._getCurrentLanguage();
    this._getNews();
  }

  _getNews(){
    this.seService.getNews()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(news => this.allNews.set(news));
  }

  //подписка на получение текущей версии приложения
  _getCurrentAppVersion() {
    this.seService.getCurrentAppVersion()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentAppVersion => {
        this.currentAppVersion.set(currentAppVersion);
      })
  }
  //подписка на получение версии приложения для пользователя
  _getUserAppVersion() {
    this.seService.getUserAppVersion()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(userAppVersion => {
        this.userAppVersion.set(userAppVersion);
      })
  }
  //подписка на получение языка для перевода
  _getCurrentLanguage() {
    this.seService.getCurrentLanguage()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentLanguage => {
        if (currentLanguage)
          this.currentLanguage.set(currentLanguage);
      })
  }

  //нажали закрыть окно
  onClose() {
    this.activeModal.close();
  }
}

import {ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, signal} from '@angular/core';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';
import {NotificationStore} from '../model/store/notification-store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TextT} from '../../../../translate/translate.config';
import {SharedTranslateService} from '../../../../translate/shared-translate.service';

@Component({
  selector: 'avi-notification',
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
  imports: [
    NgbToast
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Notification {
  private readonly stService = inject(SharedTranslateService);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  public readonly notification = input.required<NotificationStore>();
  public readonly closeNotification = output<NotificationStore>();

  protected readonly title = signal<string>("");
  protected readonly message = signal<string>("");

  constructor() {
    effect(() => {
      this.setTitle(this.notification().title);
      this.setMessage(this.notification().message)
    });
  }
  //получить список имен классов css в виде строки
  getClass(classNameList: string[]) {
    return classNameList.toString().replaceAll(',', ' ')
  }
  //установить заголовок уведомления
  setTitle(text: TextT | string) {
    this.stService.getTranslateText(text)
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe({
        next: translateText => {
          this.title.set(translateText);
        }
      });
  }
  //установить сообщение уведомления
  setMessage(text: TextT | string) {
    this.stService.getTranslateText(text)
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe({
        next: translateText => {
          this.message.set(translateText);
        }
      });
  }
  //закрываем уведомления
  removeNotification(notification: NotificationStore) {
    this.closeNotification.emit(notification);
  }
}

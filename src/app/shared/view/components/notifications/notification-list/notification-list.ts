import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {NotificationService} from '../notification.service';
import {NotificationStore} from '../model/store/notification-store';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Notification} from '../notification/notification';

@Component({
  selector: 'avi-notification-list',
  imports: [
    Notification
  ],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
//Дополнительно создан компонент notification-list для того, чтоб в нем передавать отдельное уведомление в компонент notification.
//Это необходимо для того, чтобы при удалении из любого места уведомления,
//уничтожался компонент и происходила автоматическая отписка от переводчика.
//Можно сделать список подписок в виде объектов {id, subscription} и отслеживать какие уведомления закрываются/удаляются и
//автоматически пробегать по списку, искать объект по id и делать отписку, но это так лень реализовывать, что проще сделать компонент
export class NotificationList {
  private readonly nService = inject(NotificationService);

  protected readonly notificationList = signal<NotificationStore[]>([]);

  constructor() {
    this.nService.getNotificationList()
      .pipe(takeUntilDestroyed())
      .subscribe(notificationList => {
        this.notificationList.set(notificationList);
      });
  }
  //удаляем уведомление из списка
  removeNotification(notification: NotificationStore) {
    this.nService.removeNotification(notification);
  }
}

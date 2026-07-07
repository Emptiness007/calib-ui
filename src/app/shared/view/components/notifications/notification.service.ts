import { Injectable } from '@angular/core';
import {NotificationDelayEnum, NotificationTitleEnum} from './notification.config';
import {NotificationStore} from './model/store/notification-store';
import {BehaviorSubject} from 'rxjs';
import {TextT} from '../../../translate/translate.config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationList: NotificationStore[] = [];
  private readonly notificationList$ = new BehaviorSubject<NotificationStore[]>([]);

  //получение отображаемых уведомлений
  getNotificationList() {
    return this.notificationList$.asObservable();
  }
  //формируем новый список уведомлений
  private setNotificationList() {
    this.notificationList$.next([...this.notificationList]);
  }
  //формирование текста заголовка уведомления
  private setTitle(defaultText: NotificationTitleEnum, text: TextT | string | null = null) {
    return text ? text : new TextT(defaultText);
  }

  //положительные уведомления (Fixed - без авто закрытия, Adm - аварийный случай)
  showPositive(message: TextT | string) {
    this.notificationList.push(new NotificationStore("", message, ["bg-success", "text-light"], true));
    this.setNotificationList();
  }
  showPositiveFixed(message: TextT | string, title: TextT | string | null = null) {
    this.notificationList.push(
      new NotificationStore(this.setTitle(NotificationTitleEnum.SUCCESS, title), message, ["bg-success", "text-light"]));
    this.setNotificationList();
  }
  showPositiveFixedAdm(message: TextT | string, title: TextT | string | null = null) {
    this.notificationList.push(
      new NotificationStore(this.setTitle(NotificationTitleEnum.INFODEV, title), message, ["bg-success", "text-light"]));
    this.setNotificationList();
  }
  //осторожные уведомления (Fixed - без авто закрытия, Adm - аварийный случай)
  showWarning(message: TextT | string, title: TextT | string | null = null) {
    this.notificationList.push(
      new NotificationStore(this.setTitle(NotificationTitleEnum.ATTENTION, title), message,
        ["bg-warning", "text-black"], true, NotificationDelayEnum.TEN));
    this.setNotificationList();
  }
  showWarningFixed(message: TextT | string, title: TextT | string | null = null) {
    this.notificationList.push(
      new NotificationStore(this.setTitle(NotificationTitleEnum.ATTENTION, title), message, ["bg-warning", "text-black"]));
    this.setNotificationList();
  }
  showWarningFixedAdm(message: TextT | string, title: TextT | string | null = null) {
    this.notificationList.push(
      new NotificationStore(this.setTitle(NotificationTitleEnum.INFODEV, title), message, ["bg-warning", "text-black"]));
    this.setNotificationList();
  }
  //негативные уведомления (Fixed - без авто закрытия, Adm - аварийный случай)
  showNegative(message: TextT | string, title: TextT | string | null = null) {
    this.notificationList.push(
      new NotificationStore(this.setTitle(NotificationTitleEnum.ERROR, title), message,
        ["bg-danger", "text-light"], true, NotificationDelayEnum.FIFTEEN));
    this.setNotificationList();
  }
  showNegativeFixed(message: TextT | string, title: TextT | string | null = null) {
    this.notificationList.push(
      new NotificationStore(this.setTitle(NotificationTitleEnum.ERROR, title), message, ["bg-danger", "text-light"]));
    this.setNotificationList();
  }
  showNegativeFixedAdm(message: TextT | string, title: TextT | string | null = null) {
    this.notificationList.push(
      new NotificationStore(this.setTitle(NotificationTitleEnum.INFODEV, title), message, ["bg-danger", "text-light"]));
    this.setNotificationList();
  }

  //удалить конкретное уведомление
  removeNotification(notification: NotificationStore) {
    this.notificationList = this.notificationList.filter((n) => n !== notification);
    this.setNotificationList();
  }
  //очистить все уведомления
  removeAll() {
    this.notificationList = [];
    this.setNotificationList();
  }
}

//этот объект будет передаваться в уведомления для отображения
import {TextT} from '../../../../../translate/translate.config';
import {NotificationDelayEnum} from '../../notification.config';

export class NotificationStore {
  constructor(title: TextT | string, message: TextT | string, classNameList: string[],
              autoHide: boolean = false, delayHide: number = NotificationDelayEnum.FIVE) {
    this.title = title;
    this.message = message;
    this.classNameList = classNameList;
    this.autoHide = autoHide;
    this.delayHide = delayHide;
  }
  id = crypto.randomUUID();
  title: TextT | string;//заголовок для уведомления
  message: TextT | string;//сообщение для уведомления с переводом или без
  classNameList: string[];//передаем классы для отображения положительного/отрицательного и т.д. вида
  autoHide: boolean;//автоматическое закрытие уведомления
  delayHide: number;//задержка перед автоматическим закрытием уведомления
}

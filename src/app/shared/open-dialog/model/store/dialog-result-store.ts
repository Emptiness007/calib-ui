import {DialogResultEnum} from '../../dialog.config';
import {ABase} from '../../../model/dto/a-base';
//объект для передачи из диалогового окна
export class DialogResultStore {
  result: DialogResultEnum;//результат диалогового окна
  oldObj: ABase | null;//старый объект, который передали в диалоговое окно
  newObj: ABase | null;//новый объект, который создан в диалоговом окне
  actionIsDone: boolean;//действие выполнено или нет

  constructor(result: DialogResultEnum, oldObj: ABase | null = null, newObj: ABase | null = null, actionIsDone: boolean = false) {
    this.result = result;
    this.oldObj = oldObj;
    this.newObj = newObj;
    this.actionIsDone = actionIsDone;
  }
}

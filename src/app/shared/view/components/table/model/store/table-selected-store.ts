import {ABase} from '../../../../../model/dto/a-base';

export class TableSelectedStore<T extends ABase & Record<string, any>> {
  readonly selectedObject: T;
  readonly isShow: boolean;
  readonly isContextMenu: boolean;

  constructor(selectedObject: T, isShow: boolean = false, isContextMenu: boolean = false) {
    this.selectedObject = selectedObject;
    this.isShow = isShow;
    this.isContextMenu = isContextMenu;
  }
}

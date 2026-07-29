import { inject, Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  DEFAULT_ANIMATION,
  DEFAULT_BACKDROP,
  DEFAULT_KEYBOARD,
  DEFAULT_SCROLLABLE,
  DEFAULT_SIZE,
  DialogSizeEnum
} from './dialog.config';
import { AboutDialog } from '../view/dialogs/about-dialog/about-dialog/about-dialog';
import { NewsDialog } from '../view/dialogs/news-dialog/news-dialog/news-dialog';
import { Observable } from 'rxjs';
import { DialogResultStore } from './model/store/dialog-result-store';
import { SettingsDialog } from '../view/dialogs/settings-dialog/settings-dialog';
import { ErrorDialog } from '../view/dialogs/error-dialog/error-dialog';
import { CustomError } from '../error/error.config';
import { InformationDialog } from '../view/dialogs/information-dialog/information-dialog';
import { TextT } from '../translate/translate.config';

@Injectable({
  providedIn: 'root'
})
export class SharedDialogsService {
  private readonly modal = inject(NgbModal);
  private readonly modalConfig = inject(NgbModalConfig);

  constructor() {
    this.modalConfig.backdrop = DEFAULT_BACKDROP;
    this.modalConfig.keyboard = DEFAULT_KEYBOARD;
    this.modalConfig.animation = DEFAULT_ANIMATION;
    this.modalConfig.scrollable = DEFAULT_SCROLLABLE;
    this.modalConfig.size = DEFAULT_SIZE;
  }
  //открытие окна с информацией (Базовое, его используют только внутри сервиса)
  private openInfoDialog(dialogTitle: TextT | string, dialogMessage: TextT | string, onlyInfo: boolean = true,
    buttonDelete: boolean = false, nameActionButton: TextT | string | null = null, size: DialogSizeEnum = DialogSizeEnum.MD) {
    const infoDialog = this.modal.open(InformationDialog, { size: size });
    infoDialog.componentInstance.dialogTitle = dialogTitle;
    infoDialog.componentInstance.dialogMessage = dialogMessage;
    infoDialog.componentInstance.onlyInfo = onlyInfo;
    infoDialog.componentInstance.buttonDelete = buttonDelete;
    infoDialog.componentInstance.nameActionButton = nameActionButton;
    return infoDialog;
  }

  //открытие окна подтверждения для положительных сценариев (например создать/восстановить)
  openConfirmPositiveDialog(dialogTitle: TextT | string, dialogMessage: TextT | string,
    nameButtonConfirm?: TextT | string): Observable<DialogResultStore> {
    return this.openInfoDialog(dialogTitle, dialogMessage, false, false, nameButtonConfirm).closed;
  }
  //открытие окна подтверждения для отрицательных сценариев (например удалить/забраковать)
  openConfirmNegativeDialog(dialogTitle: TextT | string, dialogMessage: TextT | string,
    nameButtonDelete?: TextT | string): Observable<DialogResultStore> {
    return this.openInfoDialog(dialogTitle, dialogMessage, false, true, nameButtonDelete).closed;
  }
  //открытие окна информации
  openInformationDialog(dialogTitle: TextT | string, dialogMessage: TextT | string,
    size: DialogSizeEnum = DialogSizeEnum.MD): Observable<DialogResultStore> {
    return this.openInfoDialog(dialogTitle, dialogMessage, true, false, null, size).closed;
  }
  //открытие окна с ошибкой
  openErrorDialog(newError: CustomError, oldError: any): Observable<DialogResultStore> {
    const errorDialog = this.modal.open(ErrorDialog, { backdropClass: 'dialog-error-backdrop-config' });
    errorDialog.componentInstance.newError = newError;
    errorDialog.componentInstance.oldError = oldError;
    return errorDialog.closed;
  }
  //открытие окна настроек
  openSettingsDialog(): Observable<boolean> {
    return this.modal.open(SettingsDialog, { size: DialogSizeEnum.XL, backdropClass: 'dialog-settings-backdrop-config' }).closed;
  }
  //открытие окна с новостями
  openNewsDialog(): Observable<void> {
    return this.modal.open(NewsDialog, { backdropClass: 'dialog-news-backdrop-config', size: DialogSizeEnum.XL }).closed;
  }
  //открытие окна о приложении
  openAboutDialog(): Observable<void> {
    return this.modal.open(AboutDialog, { backdropClass: 'dialog-about-backdrop-config', size: DialogSizeEnum.XL }).closed;
  }
}

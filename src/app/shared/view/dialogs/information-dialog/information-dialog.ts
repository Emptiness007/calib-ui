import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TextT} from '../../../translate/translate.config';
import {DialogResultStore} from '../../../open-dialog/model/store/dialog-result-store';
import {DialogResultEnum} from '../../../open-dialog/dialog.config';
import {TranslatePipe} from '@ngx-translate/core';
import {SharedTranslateService} from '../../../translate/shared-translate.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SharedChecker} from '../../../shared-constant.config';

@Component({
  selector: 'app-information-dialog',
  imports: [
    TranslatePipe
  ],
  templateUrl: './information-dialog.html',
  styleUrl: './information-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationDialog implements OnInit {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);
  private readonly stService = inject(SharedTranslateService);

  dialogTitle: TextT | string = new TextT("SHARED.DIALOG.INFORMATION.TITLE");
  dialogMessage: TextT | string = new TextT("SHARED.DIALOG.INFORMATION.IS-EMPTY");
  nameActionButton: TextT | string = new TextT("SHARED.BUTTON.ACCEPT");
  buttonDelete = false;
  onlyInfo = true;

  readonly onlyInfoSignal = signal(true);
  readonly isDelete = signal(false);
  readonly nameActionButtonSignal = signal("");
  readonly title = signal("");
  readonly message = signal("");

  ngOnInit() {
    if (!SharedChecker.isEmptyString(this.dialogTitle) || !SharedChecker.isEmptyString((this.dialogTitle as TextT).key))
      this.setTranslateText(this.dialogTitle, this.title);
    if (!SharedChecker.isEmptyString(this.dialogMessage) || !SharedChecker.isEmptyString((this.dialogMessage as TextT).key))
      this.setTranslateText(this.dialogMessage, this.message);
    if (!SharedChecker.isEmptyString(this.nameActionButton) || !SharedChecker.isEmptyString((this.nameActionButton as TextT).key))
      this.setTranslateText(this.nameActionButton, this.nameActionButtonSignal);
    this.isDelete.set(this.buttonDelete);
    this.onlyInfoSignal.set(this.onlyInfo);
  }
//установить заголовок уведомления
  setTranslateText(text: TextT | string, signalToSet: WritableSignal<string>) {
    this.stService.getTranslateText(text)
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe({
        next: translateText => {
          signalToSet.set(translateText);
        }
      });
  }
  //нажали на доп кнопку accept/delete
  onAccept() {
    this.activeModal.close(new DialogResultStore(DialogResultEnum.ACCEPT));
  }
  //нажали на кнопку cancel
  onCancel() {
    this.activeModal.close(new DialogResultStore(DialogResultEnum.EXIT));
  }
}

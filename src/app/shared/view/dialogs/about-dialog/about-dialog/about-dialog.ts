import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {NgbActiveModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {APP_NAME, CURRENT_APP_VERSION} from '../../../../../app.constant.config';
import * as packageInfo from '../../../../../../../package.json';
import {WorkerStore} from '../model/store/worker-store';
import {LIBRARIES_KEY, StackEnum, WORKERS_KEY} from '../about.config';
import {catchError, of} from 'rxjs';
import {StackStore} from '../model/store/stack-store';
import {DELAY_TIME_OPEN_FOR_TOOLTIP} from '../../../../shared-constant.config';

@Component({
  selector: 'app-about-dialog',
  imports: [
    TranslatePipe,
    NgbTooltip
  ],
  templateUrl: './about-dialog.html',
  styleUrl: './about-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutDialog {
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);
  private readonly activeModal = inject(NgbActiveModal);
  private readonly tService = inject(TranslateService);

  protected readonly openTooltipDelay = DELAY_TIME_OPEN_FOR_TOOLTIP;
  protected readonly APP_NAME = APP_NAME;
  protected readonly CURRENT_APP_VERSION = CURRENT_APP_VERSION;

  workerList: WorkerStore[] = [];
  stackList: StackStore[] = [];

  constructor() {
    this.initWorkerList();
    this.initStackList();
  }
  //инициализация массива работников
  initWorkerList() {
    this.tService.get(WORKERS_KEY)
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy),
        catchError((error) => {
          console.log('Failed to load workers:', error);
          return of({});
        }))
      .subscribe((workerList: Record<string, any>) => {
        this.workerList = Object.values(workerList || {})
          .map(({FIO = '', POST = '', PHONE = '', EMAIL = ''}) => new WorkerStore(FIO, POST, PHONE, EMAIL));
      });
  }
  //инициализация массива библиотек
  initStackList(){
    const angular = new StackStore('Angular', packageInfo.dependencies[StackEnum.ANGULAR].substring(1), LIBRARIES_KEY + '.FRAMEWORK');
    const typeScript = new StackStore('TypeScript', packageInfo.devDependencies[StackEnum.TYPESCRIPT].substring(1), LIBRARIES_KEY + '.PROGRAMMING-LANGUAGE');
    const bootstrap = new StackStore('Bootstrap | HTML, CSS', packageInfo.dependencies[StackEnum.BOOTSTRAP].substring(1), LIBRARIES_KEY + '.TOOL-SET');
    const rxjs = new StackStore('RxJS', packageInfo.dependencies[StackEnum.RXJS].substring(1), LIBRARIES_KEY + '.RXJS');
    const other = new StackStore('', '', LIBRARIES_KEY + '.OTHER-MODULES');

    this.stackList = [angular, bootstrap, typeScript, rxjs, other];
  }
  //нажали закрыть окно
  onClose() {
    this.activeModal.close();
  }
}

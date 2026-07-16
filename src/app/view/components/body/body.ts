import {Component, DestroyRef, inject, signal} from '@angular/core';
import {CalculationTypeEnum} from '../../../data/constant/calculation.type.enum';

import {EventsService} from '../../../data/service/events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {CalculationPage} from '../calculation-page/calculation-page';

@Component({
  selector: 'app-body',
  imports: [
    TranslatePipe,
    CalculationPage
  ],
  templateUrl: './body.html',
  styleUrl: './body.scss',
})
export class Body  {
  private readonly eService = inject(EventsService);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  protected readonly izdelieTypes = Object.values(CalculationTypeEnum);
  activeTab = signal<CalculationTypeEnum>(CalculationTypeEnum.NA);

  constructor() {
    this._changeTab();
  }

  _changeTab(){
    this.eService.getCurrentTab()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(tab => this.activeTab.set(tab));
  }

  onChangeTab(t: CalculationTypeEnum){
    this.eService.setCurrentTab(t);
  }

  protected readonly CalculationTypeEnum = CalculationTypeEnum;
}

import {Component, DestroyRef, inject, input, OnInit, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {StepInputData} from '../../../data/model/step-input-data';
import {StepResultData} from '../../../data/model/step-result-data';
import {CalculationTypeEnum} from '../../../data/model/calculation.type.enum';
import {CalculationService} from '../../../data/service/calculation.service';
import {
  getHeightA1,
  getHeightA2,
  getPhysicalConstants,
  getStages,
  getTolerance
} from '../../../data/constant/calculation-constants';
import {EventsService} from '../../../data/service/events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  INPUT_FIELD_LIST,
  INPUT_TABLE_FIELDS,
  OUTPUT_FIELD_LIST,
  OUTPUT_TABLE_FIELDS
} from '../../../app.constant.config';

@Component({
  selector: 'app-calculation-page',
  imports: [
    TranslatePipe,
  ],
  templateUrl: './calculation-page.html',
  styleUrl: './calculation-page.scss',
})
export class CalculationPage implements OnInit{
  private readonly calculationService = inject(CalculationService);
  private readonly eService= inject(EventsService);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  izdelieType = input.required<CalculationTypeEnum>();
  inputRows = signal<StepInputData[]>([]);
  outputRows = signal<StepResultData[]>([]);
  canCalculate = signal<boolean>(false);

  inputFieldList = INPUT_FIELD_LIST;
  outputFieldList = OUTPUT_FIELD_LIST;

  ngOnInit() {
    this.initData();
    this.checkEmptyInput();
    this._changeInputData();
    this._changeResultData();
  }

  _changeInputData(){
    this.eService.getStepData()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(data => {
        if (data && data.length > 0) {
          this.inputRows.set(data);
        }
      })
  }

  _changeResultData(){
    this.eService.getResultData()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(data => {
        if(data ){
          this.outputRows.set(data);
        }
      })
  }

  initData(){
    const stages = getStages(this.izdelieType());

    const rows= stages.map(stage =>{
      const a1 = getHeightA1(this.izdelieType(), stage);
      const a2 = getHeightA2(this.izdelieType(), stage);

      const row = new StepInputData(stage, a1, a2);
      row.rNomIn = '';
      row.rNomOut = '';
      return row;
    })

    this.inputRows.set(rows);
    this.outputRows.set([]);
  }

  calculateAll(){
    const results: StepResultData[] = this.inputRows().map(row => {
      const rNomIn = Number(row.rNomIn);
      const rNomOut = Number(row.rNomOut);

      if (!Number.isFinite(rNomIn) || !Number.isFinite(rNomOut)) {
        return { stage: row.stage };
      }

      return this.calculationService.calculate({
        type: this.izdelieType(),
        stage: row.stage,
        rNomIn,
        rNomOut
      });
    });
    this.outputRows.set(results);
    this.eService.setResultData(results);
  }

  formatAngle(angle: any): string {
    if (!angle) return '';
    return `${angle.degrees}°${angle.minutes}'${angle.seconds}''`;
  }

  updateCell(rowIndex: number, field: keyof StepInputData, value: string) {
    const rows = [...this.inputRows()];
    (rows[rowIndex] as any)[field] = value;
    this.inputRows.set(rows);
    this.eService.setStepData(rows);
    this.checkEmptyInput();
  }

  private checkEmptyInput(){
    const rows = this.inputRows();

    const empty = rows.every(row => {
      const inVal = row.rNomIn?.trim() ?? '';
      const outVal = row.rNomOut?.trim() ?? '';
      return(
        inVal !== '' && outVal !== ''
      );
    });
    this.canCalculate.set(empty);
  }

  clearAllInput(){
    this.initData();
    this.eService.setStepData([]);
    this.eService.setResultData([]);
  }

  protected readonly getTolerance = getTolerance;
  protected readonly getPhysicalConstants = getPhysicalConstants;
  protected readonly INPUT_TABLE_FIELDS = INPUT_TABLE_FIELDS;
  protected readonly OUTPUT_TABLE_FIELDS = OUTPUT_TABLE_FIELDS;
}

import {Component, computed, DestroyRef, effect, inject, input, OnInit, signal, untracked} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {StepInputData} from '../../../data/model/step-input-data';
import {StepResultData} from '../../../data/model/step-result-data';
import {CalculationTypeEnum} from '../../../data/constant/calculation.type.enum';
import {CalculationService} from '../../../data/service/calculation.service';
import {
  getHeightA1,
  getHeightA2,
  getPhysicalConstants,
  getTolerance
} from '../../../data/constant/calculation-constants';
import {EventsService} from '../../../data/service/events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
  getDisplayFields, getOutputFields,
  getRequiredFields,
  getStagesByConfig,
  INPUT_FIELDS, isSpecialCaseStage, OUTPUT_FIELDS
} from '../../../data/constant/calculation-stage.config';
import {Angle} from '../../../data/model/interface/angle.interface';
import {ExcelExportService} from '../../../data/service/excel-export.service';
import {saveAs} from 'file-saver';

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
  private readonly eventsService= inject(EventsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly excelExportService = inject(ExcelExportService);

  izdelieType = input.required<CalculationTypeEnum>();
  inputRows = signal<StepInputData[]>([]);
  outputRows = signal<StepResultData[]>([]);
  canCalculate = signal<boolean>(false);
  calculateIsDone = signal<boolean>(false);

  readonly inputFieldList = computed(() => {
    const stages = this.stageList();
    if (stages.length === 0) return [];
    return getDisplayFields(this.izdelieType(), stages[0]);
  });

  readonly outputFieldList = computed(() => {
    const stages = this.stageList();
    if (stages.length === 0) return [];
    return getOutputFields(this.izdelieType(), stages[0]);
  });

  private readonly stageList = computed(() => {
    return getStagesByConfig(this.izdelieType(), () => true);
  });

  constructor() {
    effect(() => {
      this.izdelieType();

      untracked(() => {
        this.initializeData();
        this.eventsService.setStepData([]);
        this.eventsService.setResultData([]);
      });
    });
  }

  ngOnInit() {
    //this.setupSubscriptions();
  }

  private initializeData(): void {
    const stages = this.stageList();
    const rows = stages.map(stage => {
      const a1 = getHeightA1(this.izdelieType(), stage);
      const a2 = getHeightA2(this.izdelieType(), stage);
      return new StepInputData(stage, a1, a2);
    });

    this.inputRows.set(rows);
    this.outputRows.set([]);
    this.calculateIsDone.set(false);
    this.updateCanCalculate();
  }

  private setupSubscriptions(): void {
    this.eventsService.getStepData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        if (data?.length) {
          this.inputRows.set(data);
          this.updateCanCalculate();
        }
      });

    this.eventsService.getResultData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        if (data) {
          this.outputRows.set(data);
        }
      });
  }

  calculateAll(): void {
    const type = this.izdelieType();

    const results = this.inputRows().map(row => {
      const required = getRequiredFields(type, row.stage);

      const needIn = required.includes(INPUT_FIELDS.R_NOM_IN);
      const needOut = required.includes(INPUT_FIELDS.R_NOM_OUT);

      if (needIn && !this.hasValue(row.rNomIn)) return { stage: row.stage };
      if (needOut && !this.hasValue(row.rNomOut)) return { stage: row.stage };

      const rNomIn = needIn ? Number(row.rNomIn) : NaN;
      const rNomOut = needOut ? Number(row.rNomOut) : NaN;

      if (needIn && !this.isValidNumber(rNomIn)) return { stage: row.stage };
      if (needOut && !this.isValidNumber(rNomOut)) return { stage: row.stage };

      const payload: any = {
        type,
        stage: row.stage,
      };

      if (needIn) payload.rNomIn = rNomIn;
      if (needOut) payload.rNomOut = rNomOut;

      return this.calculationService.calculate(payload);
    });

    this.outputRows.set(results);
    this.calculateIsDone.set(true);
    this.eventsService.setResultData(results);
  }



  updateCell(rowIndex: number, field: keyof StepInputData, value: string): void {
    const rows = [...this.inputRows()];
    (rows[rowIndex] as any)[field] = value;
    this.inputRows.set(rows);
    this.eventsService.setStepData(rows);
    this.updateCanCalculate();
  }

  clearAllInput(): void {
    this.initializeData();
    this.eventsService.setStepData([]);
    this.eventsService.setResultData([]);
  }

  formatAngle(angle: Angle): string {
    if (!angle) return '';
    return `${angle.degrees}°${angle.minutes}'${angle.seconds}''`;
  }

  private updateCanCalculate(): void {
    const rows = this.inputRows();
    const allReady = rows.every(row => {
      const required = getRequiredFields(this.izdelieType(), row.stage);
      const needIn = required.includes(INPUT_FIELDS.R_NOM_IN);
      const needOut = required.includes(INPUT_FIELDS.R_NOM_OUT);

      const inOk = needIn ? this.hasValue(row.rNomIn) : true;
      const outOk = needOut ? this.hasValue(row.rNomOut) : true;

      return inOk && outOk;
    });

    this.canCalculate.set(allReady);
  }

  async getReport(): Promise<void> {
    const izdelieType = this.izdelieType();
    const inputRows = this.inputRows();
    const outputRows = this.outputRows();

    const blob = await this.excelExportService.generateReport(izdelieType, inputRows, outputRows);
    const fileName = `Отчет_${izdelieType}_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
  }

  shouldShowInputField(stage: number, field: string): boolean {
    const type = this.izdelieType();
    return getDisplayFields(type, stage).includes(field as any);
  }

  shouldShowOutputField(stage: number, field: string): boolean {
    const type = this.izdelieType();
    return getOutputFields(type, stage).includes(field as any);
  }

  private isValidNumber(value: number): boolean {
    return Number.isFinite(value) && !Number.isNaN(value);
  }

  private hasValue(value: string | null | undefined): boolean {
    return value?.trim() !== '';
  }

  protected readonly INPUT_FIELDS = INPUT_FIELDS;
  protected readonly getTolerance = getTolerance;
  protected readonly getPhysicalConstants = getPhysicalConstants;
  protected readonly OUTPUT_FIELDS = OUTPUT_FIELDS;
  protected readonly isSpecialCaseStage = isSpecialCaseStage;
}

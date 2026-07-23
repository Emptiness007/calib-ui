import {Component, computed, DestroyRef, effect, inject, input, OnInit, signal, untracked} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {StepInputData} from '../../../data/model/step-input-data';
import {StepResultData} from '../../../data/model/step-result-data';
import {CalculationService} from '../../../data/service/calculation.service';
import {EventsService} from '../../../data/service/events.service';
import {Angle} from '../../../data/model/interface/angle.interface';
import {ExcelExportService} from '../../../data/service/excel-export.service';
import {ProductConfigService} from '../../../data/service/product-config.service';
import {PartData} from '../../../data/model/product-data.interface';

export const INPUT_FIELDS = {
  STAGE: 'stage',
  A1: 'a1',
  A2: 'a2',
  R_NOM_IN: 'rNomIn',
  R_NOM_OUT: 'rNomOut',
} as const;

export const OUTPUT_FIELDS = {
  STAGE: 'stage',
  R_MAX_IN: 'rMaxIn',
  R_MAX_OUT: 'rMaxOut',
  K_CARRIAGE: 'kCarriage',
  K_PLATES_IN: 'kPlatesIn',
  K_PLATES_OUT: 'kPlatesOut',
  ANGLE: 'angle',
} as const;

@Component({
  selector: 'app-calculation-page',
  imports: [
    TranslatePipe,
  ],
  templateUrl: './calculation-page.html',
  styleUrl: './calculation-page.scss',
})
export class CalculationPage implements OnInit {
  private readonly calculationService = inject(CalculationService);
  private readonly productConfigService = inject(ProductConfigService);
  private readonly eventsService = inject(EventsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly excelExportService = inject(ExcelExportService);

  productId = input.required<string>();
  partId = input.required<string>();

  inputRows = signal<StepInputData[]>([]);
  outputRows = signal<StepResultData[]>([]);
  canCalculate = signal<boolean>(false);
  calculateIsDone = signal<boolean>(false);

  // Текущая конфигурация изделия
  protected currentPart = signal<PartData | null>(null);

  // Список полей ввода
  readonly inputFieldList = computed(() => {
    return [
      INPUT_FIELDS.STAGE,
      INPUT_FIELDS.A1,
      INPUT_FIELDS.A2,
      INPUT_FIELDS.R_NOM_IN,
      INPUT_FIELDS.R_NOM_OUT
    ];
  });

  // Список полей вывода
  readonly outputFieldList = computed(() => {
    return [
      OUTPUT_FIELDS.STAGE,
      OUTPUT_FIELDS.R_MAX_IN,
      OUTPUT_FIELDS.R_MAX_OUT,
      OUTPUT_FIELDS.K_PLATES_IN,
      OUTPUT_FIELDS.K_PLATES_OUT,
      OUTPUT_FIELDS.ANGLE
    ];
  });

  constructor() {
    effect(() => {
      this.productId();
      this.partId();

      untracked(() => {
        this.loadPartData();
      });
    });
  }

  ngOnInit() {
    //this.setupSubscriptions();
  }

  private loadPartData(): void {
    const config = this.productConfigService.getConfig();
    if (!config) {
      console.error('Config not loaded');
      return;
    }

    const product = config.product.find(p => p.id === this.productId());
    if (!product) {
      console.error(`Product ${this.productId()} not found`);
      return;
    }

    const part = product.parts.find(p => p.id === this.partId());
    if (!part) {
      console.error(`Part ${this.partId()} not found in product ${this.productId()}`);
      return;
    }

    this.currentPart.set(part);
    this.initializeData(part);
  }

  private initializeData(part: PartData): void {
    const stageKeys = Object.keys(part.stages).sort((a, b) => Number(a) - Number(b));

    const rows = stageKeys.map(stageKey => {
      const stage = Number(stageKey);
      const heightConstants = part.stages[stageKey];
      const a1 = heightConstants?.a1 ?? 0;
      const a2 = heightConstants?.a2 ?? 0;

      return new StepInputData(
        this.productId(),
        this.partId(),
        stage,
        a1,
        a2
      );
    });

    this.inputRows.set(rows);
    this.outputRows.set([]);
    this.calculateIsDone.set(false);
    this.updateCanCalculate();
  }

  calculateAll(): void {
    const part = this.currentPart();
    if (!part) return;

    const results = this.inputRows().map(row => {
      if (part.specialStages.includes(row.stage)) {
        if (!this.hasValue(row.rNomIn)) return new StepResultData();

        const payload = {
          productId: this.productId(),
          partId: this.partId(),
          stage: row.stage,
          rNomIn: Number(row.rNomIn),
          rNomOut: NaN
        };

        const result = this.calculationService.calculate(payload, part);
        const resultData = new StepResultData();
        resultData.productId = result.productId;
        resultData.partId = result.partId;
        resultData.stage = result.stage;
        resultData.rMaxIn = result.rMaxIn;
        resultData.kCarriage = result.kCarriage;
        resultData.kPlatesIn = result.kPlatesIn;
        return resultData;
      } else {
        // Для обычных ступеней нужны оба значения
        if (!this.hasValue(row.rNomIn) || !this.hasValue(row.rNomOut)) {
          return new StepResultData();
        }

        const rNomIn = Number(row.rNomIn);
        const rNomOut = Number(row.rNomOut);

        if (!this.isValidNumber(rNomIn) || !this.isValidNumber(rNomOut)) {
          return new StepResultData();
        }

        const payload = {
          productId: this.productId(),
          partId: this.partId(),
          stage: row.stage,
          rNomIn,
          rNomOut
        };

        const result = this.calculationService.calculate(payload, part);
        const resultData = new StepResultData();
        resultData.productId = result.productId;
        resultData.partId = result.partId;
        resultData.stage = result.stage;
        resultData.rMaxIn = result.rMaxIn;
        resultData.rMaxOut = result.rMaxOut;
        resultData.kCarriage = result.kCarriage;
        resultData.kPlatesIn = result.kPlatesIn;
        resultData.kPlatesOut = result.kPlatesOut;
        resultData.angle = result.angle;
        return resultData;
      }
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
    const part = this.currentPart();
    if (part) {
      this.initializeData(part);
    }
    this.eventsService.setStepData([]);
    this.eventsService.setResultData([]);
  }

  formatAngle(angle: Angle): string {
    if (!angle) return '';
    return `${angle.degrees}°${angle.minutes}'${angle.seconds}''`;
  }

  private updateCanCalculate(): void {
    const rows = this.inputRows();
    const part = this.currentPart();
    if (!part) {
      this.canCalculate.set(false);
      return;
    }

    const allReady = rows.every(row => {
      if (part.specialStages.includes(row.stage)) {
        return this.hasValue(row.rNomIn);
      } else {
        return this.hasValue(row.rNomIn) && this.hasValue(row.rNomOut);
      }
    });

    this.canCalculate.set(allReady);
  }

  async getReport(): Promise<void> {
    const part = this.currentPart();
    if (!part) return;

    const inputRows = this.inputRows();
    const outputRows = this.outputRows();

    await this.excelExportService.generateReport(part, inputRows, outputRows);
  }

  isSpecialStage(stage: number): boolean {
    const part = this.currentPart();
    return part?.specialStages.includes(stage) ?? false;
  }

  private isValidNumber(value: number): boolean {
    return Number.isFinite(value) && !Number.isNaN(value);
  }

  private hasValue(value: string | null | undefined): boolean {
    return value?.trim() !== '';
  }

  protected readonly INPUT_FIELDS = INPUT_FIELDS;
  protected readonly OUTPUT_FIELDS = OUTPUT_FIELDS;
}

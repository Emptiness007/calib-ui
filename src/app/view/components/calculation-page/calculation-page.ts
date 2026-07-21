import {Component, computed, DestroyRef, effect, inject, input, OnInit, signal, untracked} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {StepInputData} from '../../../data/model/step-input-data';
import {StepResultData} from '../../../data/model/step-result-data';
import {CalculationService} from '../../../data/service/calculation.service';
import {IzdelieConfigService} from '../../../data/service/izdelie-config.service';
import {IzdelieConfigData} from '../../../data/model/izdelie-data.interface';
import {EventsService} from '../../../data/service/events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Angle} from '../../../data/model/interface/angle.interface';
import {ExcelExportService} from '../../../data/service/excel-export.service';


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
  private readonly izdelieConfigService = inject(IzdelieConfigService);
  private readonly eventsService = inject(EventsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly excelExportService = inject(ExcelExportService);

  // Входные параметры: sectionId и izdelieId
  sectionId = input.required<string>();
  izdelieId = input.required<string>();

  inputRows = signal<StepInputData[]>([]);
  outputRows = signal<StepResultData[]>([]);
  canCalculate = signal<boolean>(false);
  calculateIsDone = signal<boolean>(false);

  // Текущая конфигурация изделия
  protected currentIzdelie = signal<IzdelieConfigData | null>(null);

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

  private readonly stageList = computed(() => {
    const izdelie = this.currentIzdelie();
    return izdelie ? izdelie.stages : [];
  });

  constructor() {
    effect(() => {
      this.sectionId();
      this.izdelieId();

      untracked(() => {
        this.loadIzdelieData();
      });
    });
  }

  ngOnInit() {
    //this.setupSubscriptions();
  }

  private loadIzdelieData(): void {
    const section = this.izdelieConfigService.getSectionById(this.sectionId());
    if (!section) {
      console.error(`Section ${this.sectionId()} not found`);
      return;
    }

    const izdelie = section.izdelies.find(i => i.id === this.izdelieId());
    if (!izdelie) {
      console.error(`Izdelie ${this.izdelieId()} not found in section ${this.sectionId()}`);
      return;
    }

    this.currentIzdelie.set(izdelie);
    this.initializeData(izdelie);
  }

  private initializeData(izdelie: IzdelieConfigData): void {
    const stages = izdelie.stages;
    const rows = stages.map(stage => {
      const stageKey = stage.toString();
      const heightConstants = izdelie.heightConstants[stageKey];
      const a1 = heightConstants?.a1 ?? 0;
      const a2 = heightConstants?.a2 ?? 0;

      return new StepInputData(this.sectionId(), this.izdelieId(), stage, a1, a2);
    });

    this.inputRows.set(rows);
    this.outputRows.set([]);
    this.calculateIsDone.set(false);
    this.updateCanCalculate();
  }

  calculateAll(): void {
    const izdelie = this.currentIzdelie();
    if (!izdelie) return;

    const results = this.inputRows().map(row => {
      // Проверяем специальные ступени
      if (izdelie.specialStages.includes(row.stage)) {
        // Для специальных ступеней нужен только rNomIn
        if (!this.hasValue(row.rNomIn)) return new StepResultData();

        const payload = {
          sectionId: this.sectionId(),
          izdelieId: this.izdelieId(),
          stage: row.stage,
          rNomIn: Number(row.rNomIn),
          rNomOut: NaN
        };

        const result = this.calculationService.calculate(payload, izdelie);
        const resultData = new StepResultData();
        resultData.sectionId = result.sectionId;
        resultData.izdelieId = result.izdelieId;
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
          sectionId: this.sectionId(),
          izdelieId: this.izdelieId(),
          stage: row.stage,
          rNomIn,
          rNomOut
        };

        const result = this.calculationService.calculate(payload, izdelie);
        const resultData = new StepResultData();
        resultData.sectionId = result.sectionId;
        resultData.izdelieId = result.izdelieId;
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
    const izdelie = this.currentIzdelie();
    if (izdelie) {
      this.initializeData(izdelie);
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
    const izdelie = this.currentIzdelie();
    if (!izdelie) {
      this.canCalculate.set(false);
      return;
    }

    const allReady = rows.every(row => {
      if (izdelie.specialStages.includes(row.stage)) {
        return this.hasValue(row.rNomIn);
      } else {
        return this.hasValue(row.rNomIn) && this.hasValue(row.rNomOut);
      }
    });

    this.canCalculate.set(allReady);
  }

  async getReport(): Promise<void> {
    const izdelie = this.currentIzdelie();
    if (!izdelie) return;

    const inputRows = this.inputRows();
    const outputRows = this.outputRows();

    await this.excelExportService.generateReport(izdelie, inputRows, outputRows);
  }

  isSpecialStage(stage: number): boolean {
    const izdelie = this.currentIzdelie();
    return izdelie?.specialStages.includes(stage) ?? false;
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

import {inject, Injectable} from '@angular/core';
import {AngleConverterService} from './angle-converter.service';
import {CalculationInput} from '../model/interface/calculation-input.interface';
import {CalculationOutput} from '../model/interface/calculation-output.interface';
import {Angle} from '../model/interface/angle.interface';
import {IzdelieConfigData} from '../model/izdelie-data.interface';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  private readonly angleConverter = inject(AngleConverterService);

  /**
   * Выполняет расчет для указанной ступени
   * @param input - входные данные расчета
   * @param izdelie - конфигурация изделия
   * @returns результаты расчета
   */
  calculate(input: CalculationInput, izdelie: IzdelieConfigData): CalculationOutput {
    const { stage, rNomIn, rNomOut } = input;

    // Получаем константы высот для ступени
    const stageKey = stage.toString();
    const heightConstants = izdelie.heightConstants[stageKey];
    const a1 = heightConstants?.a1 ?? 0;
    const a2 = heightConstants?.a2 ?? 0;

    // Получаем другие константы из конфигурации изделия
    const x = izdelie.tolerance;
    const { baseOffset, hSet, hMeasured } = izdelie.physicalConstants;

    // Расчет максимальных значений
    const rMaxIn = this.round(rNomIn + x, 2);
    const rMaxOut = this.round(rNomOut + x, 2);

    // Расчет плиток
    const kCarriage = this.round(hSet - hMeasured, 4);
    const kPlatesIn = this.round(rNomIn - baseOffset + kCarriage, 4);
    const kPlatesOut = this.round(rNomOut - baseOffset + kCarriage, 4);

    // Расчет угла (если a1 != a2)
    let angle = { degrees: 0, minutes: 0, seconds: 0, decimal: 0 };
    if (Math.abs(a1 - a2) > 0.000001) {
      const tanValue = (rNomIn - rNomOut) / (a1 - a2);
      const angleDecimal = Math.abs(Math.atan(tanValue) * 180 / Math.PI);
      angle = this.angleConverter.toDMS(angleDecimal);
    }

    return {
      sectionId: input.sectionId,
      izdelieId: input.izdelieId,
      stage,
      rMaxIn,
      rMaxOut,
      kCarriage,
      kPlatesIn,
      kPlatesOut,
      angle
    };
  }

  private round(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
}

import {inject, Injectable} from '@angular/core';
import {AngleConverterService} from './angle-converter.service';
import {CalculationInput} from '../model/interface/calculation-input.interface';
import {CalculationOutput} from '../model/interface/calculation-output.interface';
import {Angle} from '../model/interface/angle.interface';
import {PartData} from '../model/product-data.interface';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  private readonly angleConverter = inject(AngleConverterService);

  calculate(input: CalculationInput, part: PartData): CalculationOutput {
    const { stage, rNomIn, rNomOut } = input;

    // Получаем константы высот для ступени
    const stageKey = stage.toString();
    const heightConstants = part.stages[stageKey];
    const a1 = heightConstants?.a1 ?? 0;
    const a2 = heightConstants?.a2 ?? 0;

    // Получаем другие константы из конфигурации изделия
    const x = part.tolerance;
    const { baseOffset, hSet, hMeasured } = part.physicalConstants;

    // Расчет максимальных значений
    const rMaxIn = this.round(rNomIn + x, 2);
    const rMaxOut = this.round(rNomOut + x, 2);

    // Расчет плиток
    const kCarriage = this.round(hSet - hMeasured, 4);
    const kPlatesIn = this.round(rNomIn - baseOffset + kCarriage, 4);
    const kPlatesOut = this.round(rNomOut - baseOffset + kCarriage, 4);

    // Расчет угла (если a1 != a2)
    let angle: Angle = { degrees: 0, minutes: 0, seconds: 0, decimal: 0 };
    if (Math.abs(a1 - a2) > 0.000001) {
      const tanValue = (rNomIn - rNomOut) / (a1 - a2);
      const angleDecimal = Math.abs(Math.atan(tanValue) * 180 / Math.PI);
      angle = this.angleConverter.toDMS(angleDecimal);
    }

    return {
      productId: input.productId,
      partId: input.partId,
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

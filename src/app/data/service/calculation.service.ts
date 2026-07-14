import {inject, Service} from '@angular/core';
import {AngleConverterService} from './angle-converter.service';
import {CalculationInput} from '../model/interface/calculation-input.interface';
import {CalculationOutput} from '../model/interface/calculation-output.interface';
import {Angle} from '../model/interface/angle.interface';
import {
  getHeightA1,
  getHeightA2,
  getPhysicalConstants,
  getTolerance,
  hasAngleCalculation
} from '../constant/calculation-constants';

@Service()
export class CalculationService {
private readonly angleConverter =  inject(AngleConverterService);

calculate(input: CalculationInput): CalculationOutput{
  const { type, stage, rNomIn, rNomOut } = input;

  const x = getTolerance(input.type);
  const a1 = getHeightA1(input.type, input.stage);
  const a2 = getHeightA2(input.type, input.stage);
  const { baseOffset, hSet, hMeasured } = getPhysicalConstants();

  const rMaxIn = this.round(rNomIn + x, 2);
  const rMaxOut = this.round(rNomOut + x,2);

  const kCarriage = this.round(hSet - hMeasured, 4);
  const kPlatesIn = this.round(rNomIn - baseOffset + kCarriage, 4);
  const kPlatesOut = this.round(rNomOut - baseOffset + kCarriage, 4);

  let angle = { degrees: 0, minutes: 0, seconds: 0, decimal: 0 };
  if (hasAngleCalculation(type, stage)) {
    const tanValue = (rNomIn - rNomOut) / (a1 - a2);
    const angleDecimal = Math.abs(Math.atan(tanValue) * 180 / Math.PI);
    angle = this.angleConverter.toDMS(angleDecimal);
  }

  return {
    type,
    stage,
    rMaxIn,
    rMaxOut,
    kCarriage,
    kPlatesIn,
    kPlatesOut,
    angle
  }
}

private round(num: number, decimals: number){
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

}

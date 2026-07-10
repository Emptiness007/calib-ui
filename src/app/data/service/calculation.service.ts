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

  const rMaxIn = rNomIn + x;
  const rMaxOut = rNomOut + x;

  const kCarriage = hSet - hMeasured;
  const kPlatesIn = rNomIn - baseOffset + kCarriage;
  const kPlatesOut = rNomOut - baseOffset + kCarriage;

  let angle = { degrees: 0, minutes: 0, seconds: 0, decimal: 0 };
  if (hasAngleCalculation(type, stage)) {
    const tanValue = (rNomIn - rNomOut) / (a1 - a2);
    const angleDecimal = Math.abs(Math.atan(tanValue) * 180 / Math.PI);
    angle = this.angleConverter.toDMS(angleDecimal);
  }

  return {
    type,
    rMaxIn,
    rMaxOut,
    kCarriage,
    kPlatesIn,
    kPlatesOut,
    angle
  }
}

}

import {inject, Service} from '@angular/core';
import {AngleConverterService} from './angle-converter.service';
import {CalculationInput} from '../model/calculation-input.interface';
import {CalculationOutput} from '../model/calculation-output.interface';
import {BASE_OFFSET, getTolerance} from '../constant/tolerance-constant';
import {getHeightA1, getHeightA2} from '../constant/height-constants';
import {Angle} from '../model/angle.interface,ts';

@Service()
export class CalculationService {
private readonly angleConverter =  inject(AngleConverterService);

calculate(input: CalculationInput): CalculationOutput{
  const type = input.type;

  const x = getTolerance(input.type);
  const a1 = getHeightA1(input.type, input.stage);
  const a2 = getHeightA2(input.type, input.stage);

  const rMaxIn = input.rNomIn + x;
  const rMaxOut = input.rNomOut + x;

  const kCarriage = input.hSet - input.hMeasured;
  const kPlatesIn = input.rNomIn - BASE_OFFSET + kCarriage;
  const kPlatesOut = input.rNomOut - BASE_OFFSET + kCarriage;

  let angle: Angle = { degrees: 0, minutes: 0, seconds: 0, decimal: 0 };
  const tanValue = (input.rNomIn - input.rNomOut) / (a1 - a2);
  const angleDecimal = Math.abs(Math.atan(tanValue) * 180 / Math.PI);
  angle = this.angleConverter.toDMS(angleDecimal);

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

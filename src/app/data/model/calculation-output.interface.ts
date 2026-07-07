import {CalculationTypeEnum} from './calculation.type.enum';
import {Angle} from './angle.interface,ts';

export interface CalculationOutput {
  type: CalculationTypeEnum;
  rMaxIn: number; // Rmax вх (мм) — всегда
  rMaxOut: number; // Rmax вых (мм) — для NA 4-6 и KR 4-7
  kCarriage: number; //Ккаретки
  kPlatesIn: number; // Kплиток вх (мм) — всегда
  kPlatesOut: number; // Kплиток вых (мм) — для NA 4-6 и KR 4-7
  angle: Angle; // Угол в Г°М'С" — для NA 4-6 и KR 4-7
}

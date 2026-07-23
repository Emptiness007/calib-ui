import {Angle} from './angle.interface';

export interface CalculationOutput {
  productId: string;           // ID изделия
  partId: string;           // ID части изделия
  stage: number;               // ступень
  rMaxIn: number;              // Rmax вх (мм) — всегда
  rMaxOut: number;             // Rmax вых (мм) — для NA 4-6 и KR 4-7
  kCarriage: number;           // К каретки
  kPlatesIn: number;           // K плиток вх (мм) — всегда
  kPlatesOut: number;          // K плиток вых (мм) — для NA 4-6 и KR 4-7
  angle: Angle;                // Угол в Г°М'С" — для NA 4-6 и KR 4-7
}

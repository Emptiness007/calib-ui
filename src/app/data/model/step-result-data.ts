import {Angle} from './interface/angle.interface';

export class StepResultData {
  productId!: string;             // ID изделия
  partId!: string;             // ID части изделия
  stage!: number;                 // номер ступени
  rMaxIn?: number;                // Rmax вх (мм)
  rMaxOut?: number;               // Rmax вых (мм)
  kCarriage?: number;             // К каретки
  kPlatesIn?: number;             // K плиток вх (мм)
  kPlatesOut?: number;            // K плиток вых (мм)
  angle?: Angle;                  // Угол в Г°М'С"
}

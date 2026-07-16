import {CalculationTypeEnum} from './calculation.type.enum';

export interface IzdelieConfig {
  type: CalculationTypeEnum;
  tKey: string;
  stages: number[];
  heightConstants: Record<number, {a1: number, a2: number}>;
  tolerance: number;
}

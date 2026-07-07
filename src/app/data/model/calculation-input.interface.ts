import {CalculationTypeEnum} from './calculation.type.enum';

export interface CalculationInput {
  type: CalculationTypeEnum; //тип изделия
  stage: number; //ступень
  rNomIn: number; //R номинальное входящее (мм)
  rNomOut: number; //R номинальное выходящее (мм)

  hSet: number; //Н заданное (мм)
  hMeasured: number; //Н измеренное (мм)

  x?: number; //значение допуска X (мм)
  a1?: number; //высотный размер А1 (мм)
  a2?: number; //высотный размер А2 (мм)
}

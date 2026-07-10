import {CalculationTypeEnum} from '../calculation.type.enum';

export interface CalculationInput {
  type: CalculationTypeEnum; //тип изделия
  stage: number; //ступень
  rNomIn: number; //R номинальное входящее (мм)
  rNomOut: number; //R номинальное выходящее (мм)
}

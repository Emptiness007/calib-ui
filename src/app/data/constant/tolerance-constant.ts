import {CalculationTypeEnum} from '../model/calculation.type.enum';

//значения допуска X
export const ToleranceConstantsType = {
  [CalculationTypeEnum.NA]: 0.08,
  [CalculationTypeEnum.KR]: 0.055
}
//функция получения допуска
export function getTolerance(type: CalculationTypeEnum): number{
  return ToleranceConstantsType[type];
}

//значения длины каретки (заданное и измеренное)
export const H_SET = 263;
export const H_MEASURED = 262.9737;


//базовый размер для расчета Кплиток (185 + 48)
export const BASE_OFFSET = 233;

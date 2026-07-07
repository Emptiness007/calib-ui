import {CalculationTypeEnum} from '../model/calculation.type.enum';

//список значений высотных размеров А1 и А2 для калибровых точек (значения в мм)
export const HeightConstantsType: Record<CalculationTypeEnum, Record<number, { a1: number; a2: number }>> = {
  [CalculationTypeEnum.NA]: {
    4: {a1: 183, a2: 196},
    5: {a1: 135, a2: 146},
    6: {a1: 93, a2: 105},
    7: {a1: 0, a2: 0}
  },
  [CalculationTypeEnum.KR]: {
    4: {a1: 213.4, a2: 220.9},
    5: {a1: 160.4, a2: 170.4},
    6: {a1: 115.1, a2: 123.1},
    7: {a1: 70.1, a2: 76},
    8: {a1: 0, a2: 0}
  }
}

//получение значения высотных размеров
export function getHeightConstants(type: CalculationTypeEnum, stage: number): {a1: number, a2: number}{
  return HeightConstantsType[type]?.[stage];
}

export function getHeightA1(type: CalculationTypeEnum, stage: number): number {
  const data = getHeightConstants(type, stage);
  return data.a1
}

export function getHeightA2(type: CalculationTypeEnum, stage: number): number {
  const data = getHeightConstants(type, stage);
  return data.a2
}



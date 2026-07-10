import {CalculationTypeEnum} from '../model/calculation.type.enum';
import {IzdelieConfig} from '../model/izdelie-config';

// ==================== Интерфейсы ====================
export interface HeightConstants {
  a1: number;
  a2: number;
}

// ==================== Константы ====================

//список значений высотных размеров А1 и А2 для калибровых точек (значения в мм)
export const HEIGHT_CONSTANTS: Record<CalculationTypeEnum, Record<number, HeightConstants>> = {
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

//значения допуска X
export const TOLERANCE_CONSTANTS: Record<CalculationTypeEnum, number> = {
  [CalculationTypeEnum.NA]: 0.08 ,
  [CalculationTypeEnum.KR]: 0.055
};

//константы Низмеренно, Нзаданное и базовый размер для расчета Кплиток (185 + 48)
export const PHYSICAL_CONSTANTS = {
  hSet: 263,
  hMeasured: 262.9737,
  baseOffset: 233
};

export const TRANSLATE_KEY: Record<CalculationTypeEnum, string> = {
  [CalculationTypeEnum.NA]: 'CALCULATION.TYPE.NA',
  [CalculationTypeEnum.KR]: 'CALCULATION.TYPE.KR'
}


// ==================== Вспомогательные функции ====================
export function getIzdelieConfigs(): IzdelieConfig[] {
  return Object.values(CalculationTypeEnum).map(type => ({
    type,
    tKey: TRANSLATE_KEY[type],
    stages: getStages(type),
    heightConstants: HEIGHT_CONSTANTS[type],
    tolerance: TOLERANCE_CONSTANTS[type]
  }));
}

export function getStages(type: CalculationTypeEnum): number[] {
  return Object.keys(HEIGHT_CONSTANTS[type])
    .map(Number)
    .sort((a, b) => a - b);
}

export function getHeightConstants(type: CalculationTypeEnum, stage: number): HeightConstants{
  return HEIGHT_CONSTANTS[type]?.[stage];
}

export function getHeightA1(type: CalculationTypeEnum, stage: number): number{
  return getHeightConstants(type, stage).a1;
}

export function getHeightA2(type: CalculationTypeEnum, stage: number): number{
  return getHeightConstants(type, stage).a2;
}

export function getTolerance(type: CalculationTypeEnum): number{
  return TOLERANCE_CONSTANTS[type];
}

export function getPhysicalConstants() {
  return { ...PHYSICAL_CONSTANTS };
}

export function hasAngleCalculation(type: CalculationTypeEnum, stage: number): boolean {
  const h = getHeightConstants(type, stage);
  return h.a1 !== h.a2 && Math.abs(h.a1 - h.a2) > 0.000001;
}

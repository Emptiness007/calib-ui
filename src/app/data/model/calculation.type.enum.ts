export enum CalculationTypeEnum{
  NA = 'NA',
  KR = 'KR'
}

export const CalculationTypeStage: Record<CalculationTypeEnum, number[]> = {
  [CalculationTypeEnum.NA]: [4, 5, 6, 7],
  [CalculationTypeEnum.KR]: [4,5, 6, 7, 8]
}

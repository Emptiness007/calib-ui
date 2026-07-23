export interface CalculationInput {
  productId: string;           // ID изделия
  partId: string;           // ID части изделия
  stage: number;               // ступень
  rNomIn: number;              // R номинальное входящее (мм)
  rNomOut: number;             // R номинальное выходящее (мм)
}

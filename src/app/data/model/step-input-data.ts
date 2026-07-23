export class StepInputData {
  productId: string;              // ID изделия
  partId: string;              // ID части изделия
  stage: number;                  // номер ступени
  rNomIn: string;                 // R номинальное входящее
  rNomOut: string;                // R номинальное выходящее
  a1: string;                     // высотный размер А1
  a2: string;                     // высотный размер А2

  constructor(sectionId: string, izdelieId: string, stage: number, a1: number, a2: number) {
    this.productId = sectionId;
    this.partId = izdelieId;
    this.stage = stage;
    this.rNomIn = '';
    this.rNomOut = '';
    this.a1 = a1.toString();
    this.a2 = a2.toString();
  }
}

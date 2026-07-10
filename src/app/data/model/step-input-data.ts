export class StepInputData {
  stage: number;              // номер ступени
  rNomIn: string;             // R номинальное входящее
  rNomOut: string;            // R номинальное выходящее
  a1: string;                 // высотный размер А1 (редактируемое или из константы)
  a2: string;                 // высотный размер А2

  constructor(stage: number, a1: number, a2: number) {
    this.stage = stage;
    this.rNomIn = '';
    this.rNomOut = '';
    this.a1 = a1.toString();
    this.a2 = a2.toString();
  }
}

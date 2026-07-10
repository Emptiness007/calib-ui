import {Angle} from './interface/angle.interface';
export class StepResultData {
  stage?: number;
  rMaxIn?: number;
  rMaxOut?: number;
  kCarriage?: number;
  kPlatesIn?: number;
  kPlatesOut?: number;
  angle?: Angle;

  hasResults(): boolean {
    return this.rMaxIn !== undefined;
  }
}

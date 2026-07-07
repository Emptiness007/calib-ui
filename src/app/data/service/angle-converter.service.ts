import { Service } from '@angular/core';
import {Angle} from '../model/angle.interface,ts';

@Service()
export class AngleConverterService {

  toDMS(decimalDeg: number): Angle{
    const degrees = Math.floor(decimalDeg);
    const minutes =  Math.floor((decimalDeg - degrees) * 60);
    const seconds = Math.round(((decimalDeg - degrees) * 60 - minutes) * 60);

    return {
      degrees: degrees,
      minutes: minutes,
      seconds: seconds,
      decimal: decimalDeg
    }
  }
}

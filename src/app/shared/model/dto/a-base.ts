import {IBase} from './i-base';
import 'reflect-metadata';
import {Expose} from 'class-transformer';

export abstract class ABase implements IBase {
  @Expose()
  id?: number;
}

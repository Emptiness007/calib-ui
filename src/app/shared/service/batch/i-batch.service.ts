import {IBase} from '../../model/dto/i-base';
import {Observable} from 'rxjs';

export interface IBatchService<D extends IBase> {
  findAll(): Observable<D[]>;
  saveAll(dList: D[]): Observable<D[]>;
  deleteAll(): Observable<boolean>;
}

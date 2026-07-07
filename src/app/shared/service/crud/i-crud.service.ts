import {IBase} from '../../model/dto/i-base';
import {Observable} from 'rxjs';

//todo потом переписать это все нахрен, когда будет единый стандарт написания url для работы с контроллерами
export interface ICrudService<D extends IBase> {
  add(d: D): Observable<D>;
  create(d: D): Observable<D>;
  save(d: D): Observable<D>;

  get(id: number): Observable<D>;
  getById(id: number): Observable<D>;
  read(id: number): Observable<D>;
  find(id: number): Observable<D>;
  findById(id: number): Observable<D>;

  update(d: D): Observable<D>;
  edit(d: D): Observable<D>;
  saveWithId(d: D): Observable<D>;

  delete(id: number): Observable<boolean>;
  deleteById(id: number): Observable<boolean>;
}

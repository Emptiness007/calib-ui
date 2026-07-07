import {inject, Injectable} from '@angular/core';
import {IBase} from '../../model/dto/i-base';
import {ICrudService} from './i-crud.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CrudUrlEnum} from './crud.config';

@Injectable({
  providedIn: 'root'
})
export abstract class ACrudService<D extends IBase> implements ICrudService<D> {
  private readonly httpClient = inject(HttpClient);
  //string для того, чтоб можно было передавать url контроллера не из enum. Enum - часть проекта, а не раздел shared
  protected constructor(protected controllerUrl: string) { }

  add(d: D): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.ADD}`, d);
  }
  create(d: D): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.CREATE}`, d);
  }
  save(d: D): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.SAVE}`, d);
  }

  get(id: number): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.GET}`, id);
  }
  getById(id: number): Observable<D> {
    return this.httpClient.get<D>(`${this.controllerUrl}${CrudUrlEnum.GET_BY_ID}/${id}`);
  }
  read(id: number): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.READ}`, id);
  }
  find(id: number): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.FIND}`, id);
  }
  findById(id: number): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.FIND_BY_ID}`, id);
  }

  update(d: D): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.UPDATE}`, d);
  }
  edit(d: D): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.EDIT}`, d);
  }
  saveWithId(d: D): Observable<D> {
    return this.httpClient.post<D>(`${this.controllerUrl}${CrudUrlEnum.SAVE}`, d);
  }

  delete(id: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.controllerUrl}${CrudUrlEnum.DELETE}`, id);
  }
  deleteById(id: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.controllerUrl}${CrudUrlEnum.DELETE_BY_ID}`, id);
  }
}

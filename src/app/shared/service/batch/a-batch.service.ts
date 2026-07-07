import {inject, Injectable} from '@angular/core';
import {IBase} from '../../model/dto/i-base';
import {IBatchService} from './i-batch.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BatchUrlEnum} from './batch.config';

@Injectable({
  providedIn: 'root',
})
export abstract class ABatchService<D extends IBase> implements IBatchService<D>{
  private readonly httpClient = inject(HttpClient);
//string для того, чтоб можно было передавать url контроллера не из enum. Enum - часть проекта, а не раздел shared
  protected constructor(protected controllerUrl: string) { }

  findAll(): Observable<D[]> {
    return this.httpClient.post<D[]>(`${this.controllerUrl}${BatchUrlEnum.FIND_ALL}`, null);
  }
  saveAll(dList: D[]): Observable<D[]> {
    return this.httpClient.post<D[]>(`${this.controllerUrl}${BatchUrlEnum.SAVE_ALL}`, dList);
  }
  deleteAll(): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.controllerUrl}${BatchUrlEnum.DELETE_ALL}`, null);
  }
}

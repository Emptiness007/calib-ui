import {inject, Injectable} from '@angular/core';
import {IBase} from '../../model/dto/i-base';
import {IBaseSearch} from '../../model/search/i-base-search';
import {ISearchService} from './i-search.service';
import {Observable, Subject, takeUntil} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SearchUrlEnum} from './search.config';

@Injectable({
  providedIn: 'root'
})
export abstract class ASearchService<D extends IBase, S extends IBaseSearch> implements ISearchService<D, S> {
  private readonly httpClient = inject(HttpClient);
//string для того, чтоб можно было передавать url контроллера не из enum. Enum - часть проекта, а не раздел shared
  protected constructor(protected controllerUrl: string) { }

  search(s: S): Observable<D[]> {
    return this.httpClient.post<D[]>(`${this.controllerUrl}${SearchUrlEnum.SEARCH}`, s);
  }
  searchView(s: S): Observable<D[]> {
    return this.httpClient.post<D[]>(`${this.controllerUrl}${SearchUrlEnum.SEARCH_VIEW}`, s);
  }
  searchPage(s: S): Observable<any> {
    return this.httpClient.post<any>(`${this.controllerUrl}${SearchUrlEnum.PAGEABLE_SEARCH}`, s);
  }
  searchPageView(s: S): Observable<any> {
    return this.httpClient.post<any>(`${this.controllerUrl}${SearchUrlEnum.PAGEABLE_SEARCH_VIEW}`, s);
  }
}

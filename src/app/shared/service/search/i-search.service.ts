import {IBase} from '../../model/dto/i-base';
import {IBaseSearch} from '../../model/search/i-base-search';
import {Observable} from 'rxjs';

export interface ISearchService<D extends IBase, S extends IBaseSearch> {
  search(s: S): Observable<D[]>;
  searchView(s: S): Observable<D[]>;
  searchPage(s: S): Observable<any>;
  searchPageView(s: S): Observable<any>;
}

import {IBaseSearch} from './i-base-search';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION,
  SortDirectionEnum
} from './search.config';

export abstract class ABaseSearch implements IBaseSearch {
  pageNumber: number = DEFAULT_PAGE_NUMBER;
  pageSize: number = DEFAULT_PAGE_SIZE;
  sortColumn: string = DEFAULT_SORT_COLUMN;
  sortDirection: SortDirectionEnum = DEFAULT_SORT_DIRECTION;
}

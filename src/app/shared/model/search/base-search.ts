import {ABaseSearch} from './a-base-search';
import {SortDirectionEnum} from './search.config';

export class BaseSearch extends ABaseSearch {
  constructor(sortColumn: string, sortDirection: SortDirectionEnum) {
    super();
    this.sortColumn = sortColumn;
    this.sortDirection = sortDirection;
  }
}

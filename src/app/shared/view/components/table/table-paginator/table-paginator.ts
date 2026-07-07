import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output, signal} from '@angular/core';
import {DELAY_TIME_PAGE, PageSizeEnum} from '../table.config';
import {ABaseSearch} from '../../../../model/search/a-base-search';
import {debounceTime, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {
  NgbPagination,
  NgbPaginationEllipsis,
  NgbPaginationFirst,
  NgbPaginationLast,
  NgbPaginationNext,
  NgbPaginationNumber,
  NgbPaginationPrevious
} from '@ng-bootstrap/ng-bootstrap';
import {TranslatePipe} from '@ngx-translate/core';
import {SharedChecker} from '../../../../shared-constant.config';

type PageFields = Pick<ABaseSearch, 'pageNumber' | 'pageSize'>;

@Component({
  selector: 'avi-table-paginator',
  imports: [
    FormsModule,
    NgbPagination,
    NgbPaginationFirst,
    NgbPaginationLast,
    NgbPaginationPrevious,
    NgbPaginationNext,
    NgbPaginationEllipsis,
    NgbPaginationNumber,
    TranslatePipe
  ],
  templateUrl: './table-paginator.html',
  styleUrl: './table-paginator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePaginator<S extends ABaseSearch> {

  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  readonly searchObject = input.required<S | null>();
  readonly totalFoundedObjects = input.required<number | null>();
  readonly pageSizeList = input<PageSizeEnum[]>([]);
  readonly searchObjectChange = output<PageFields>()


  readonly someNumberId = signal<string>(crypto.randomUUID());
  readonly currentPageSizeList = computed(() => {
    const pageSizeList = this.pageSizeList();
    return SharedChecker.isEmptyArray(pageSizeList) ?
      Object.values(PageSizeEnum).filter(value => !SharedChecker.isString(value)) :
      Object.values(pageSizeList).filter(value => !SharedChecker.isString(value))
  });
  readonly currentPageSize = computed(() => this.searchObject()?.pageSize ?? 0);
  readonly currentPageNumber = computed(() => this.searchObject()?.pageNumber ?? 0);
  //диапазон отображаемых элементов на текущей странице
  readonly currentElements = computed(() => {
    const searchObject = this.searchObject();
    const totalFoundedObjects = this.totalFoundedObjects();
    if (!searchObject || !totalFoundedObjects || totalFoundedObjects === 0) return '0-0';
    const start = searchObject.pageNumber * searchObject.pageSize + 1;
    const end = Math.min((searchObject.pageNumber + 1) * searchObject.pageSize, totalFoundedObjects);
    return `${start}-${end}`;
  });

  private readonly searchSubject: Subject<S> = new Subject<S>();

  constructor() {
    this.searchSubject
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(searchObject => {
        if (searchObject) {
          const page: PageFields = {
            pageNumber: searchObject.pageNumber,
            pageSize: searchObject.pageSize
          };
          this.searchObjectChange.emit(page);
        }
      });
  }
  //нажали на кнопку сменить страницу
  onClickPageChanged(newPageNumber: number): void {
    const searchObjectTmp = this.searchObject();
    if (!searchObjectTmp || searchObjectTmp.pageNumber === (newPageNumber - 1)) return;
    this.searchSubject.next({
      ...searchObjectTmp,
      pageNumber: newPageNumber - 1
    });
  }
  //выбрали другое кол-во элементов на странице
  onClickPageSizeChanged(newPageSize: number): void {
    const searchObjectTmp = this.searchObject();
    if (!searchObjectTmp || searchObjectTmp.pageSize === newPageSize) return;
    this.searchSubject.next({
      ...searchObjectTmp,
      pageNumber: 0,
      pageSize: newPageSize
    });
  }
}

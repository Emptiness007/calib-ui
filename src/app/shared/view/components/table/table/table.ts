import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect, ElementRef,
  inject,
  input,
  output,
  signal, TemplateRef, untracked, viewChildren,
} from '@angular/core';
import {DELAY_TIME_DBLCLICK, DELAY_TIME_SORT, SearchObjectUseEnum} from '../table.config';
import {DEFAULT_LANGUAGE, TextT} from '../../../../translate/translate.config';
import {SharedTranslateService} from '../../../../translate/shared-translate.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION, DEFAULT_SORT_DIRECTION_INNER,
  SearchConfig,
  SortDirectionEnum
} from '../../../../model/search/search.config';
import {ABase} from '../../../../model/dto/a-base';
import {ABaseSearch} from '../../../../model/search/a-base-search';
import {DELAY_TIME_OPEN_FOR_TOOLTIP, SharedChecker} from '../../../../shared-constant.config';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {SharedEventsService} from '../../../../service/shared-events.service';
import {TableSelectedStore} from '../model/store/table-selected-store';
import {BaseSearch} from '../../../../model/search/base-search';
import {TableColorStore} from '../model/store/table-color-store';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {NgTemplateOutlet} from '@angular/common';
import {CloseContextmenuDirective} from '../../../../close-contextmenu.directive';
import {AuthAccessDirective} from '../../../../auth/auth-access.directive';
import {UserRoleAppEnum} from '../../../../auth/auth.config';

type SortAndPageFields = Pick<ABaseSearch, 'pageNumber' | 'sortColumn' | 'sortDirection'>;

@Component({
  selector: 'avi-table',
  imports: [
    TranslatePipe,
    NgbTooltip,
    NgTemplateOutlet,
    CloseContextmenuDirective,
    AuthAccessDirective
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table <T extends ABase & Record<string, any>, S extends ABaseSearch>{
  protected readonly openTooltipDelay = DELAY_TIME_OPEN_FOR_TOOLTIP;
  readonly rowList = viewChildren('tr', {read: ElementRef});

  private readonly stService = inject(SharedTranslateService);
  private readonly seService = inject(SharedEventsService);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  tableSM = input<boolean>(false);
  objectListInput = input.required<T[]>();
  objectShowFieldListInput = input.required<string[]>();
  searchObjectInput = input<S | null>(null);
  selectedObjectInput = input<T | null>(null);
  textIfObjectListIsEmptyInput = input<string>('Какой-то текст по умолчанию');
  colorByConditionListInput = input<TableColorStore[] | null>(null);
  contextMenuTemplate = input<TemplateRef<any> | null>(null);
  searchObjectChange = output<SortAndPageFields>();
  selectedObjectOutput = output<TableSelectedStore<T>>();
  reloadTable = output<void>();

  DEFAULT_SORT_COLUMN_INNER = computed(() =>{
    const fieldList = this.objectShowFieldListInput();
    return fieldList.length > 0 ? fieldList[0] : '';
  });
  currentSearchObjectUse = computed(() =>
    this.searchObjectInput() ? SearchObjectUseEnum.OUTER : SearchObjectUseEnum.INNER);
  objectList = signal<T[]>([]);//надо потому что есть внутренняя сортировка
  searchObject = signal<S | BaseSearch | null>(null);//надо потому что есть внутренняя сортировка
  selectedObject = signal<T | null>(null);
  currentSortColumn = computed(() => this.searchObject()?.sortColumn.trim() ?? '');
  currentSortDirectionIconClass = computed(() => {
    const currentSortDirection = this.searchObject()?.sortDirection ?? SortDirectionEnum.NULL;
    return currentSortDirection === SortDirectionEnum.ASC ? 'bi-sort-down-alt' : 'bi-sort-down';
  });
  errorTableConfig = signal<TextT | string | null>(null);
  positionContextMenuX = signal(0);
  positionContextMenuY = signal(0);
  showContextMenu = signal(false);

  private searchSubject = new Subject<S | BaseSearch>();
  private timeoutDBLClickId?: number;
  private currentLanguage = DEFAULT_LANGUAGE;

  constructor() {
    effect(() => {
      if (this.requiredParametersIsDone())
        untracked(() => this.initDefaultValue());
    });
    effect(() => {
      this.selectedObject.set(this.selectedObjectInput());
    });
    this.unsubscribeAfterDestroy.onDestroy(() => {
      if(this.timeoutDBLClickId)
        clearTimeout(this.timeoutDBLClickId)
    })
    this._getSearchSubject();
    this._getCurrentLanguage();
  }
  //проверка всех важных моментов для отображения таблицы
  private requiredParametersIsDone() {
    this.errorTableConfig.set(null);
    const objectList = this.objectListInput();
    //проверка на наличие массива объектов для отображения (может быть пустым [])
    if(!objectList) {
      this.setErrorTableConfig(new TextT('SHARED.TABLE.ERROR.OBJECT-LIST-IS-UNDEFINED'));
      return false;
    }
    const objectShowFieldList = this.objectShowFieldListInput();
    //проверка на наличие массива полей, необходимые для отображения в таблице
    if(!objectShowFieldList) {
      this.setErrorTableConfig(new TextT('SHARED.TABLE.ERROR.FIELD-LIST-IS-UNDEFINED'));
      return false;
    }
    //проверка массива полей, необходимых для отображения в таблице, на отсутствие элементов
    if(objectShowFieldList.length == 0) {
      this.setErrorTableConfig(new TextT('SHARED.TABLE.ERROR.FIELD-LIST-IS-EMPTY'));
      return false;
    }
    //если массив объектов есть, но он пуст, то сразу возвращаем true, т.к. сортировку и выбор элемента делать не на чем
    if (objectList.length === 0) return true;

    //проверяем что переданные поля для отображения в таблице есть в списке полей объектов (хотя бы 1)
    const missingField = objectShowFieldList.find(
      field => !Object.keys(objectList[0]).includes(field));
    if (missingField) {
      this.setErrorTableConfig(new TextT('SHARED.TABLE.ERROR.OBJECT-NOT-INCLUDE-FIELD', missingField));
      return false;
    }
    return true;
  }
  //установка ошибки, при невыполнении проверки в requiredParametersIsDone
  private setErrorTableConfig(text: TextT | string) {
    if (!text || text === '') return;
    this.stService.getTranslateText(text)
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe({
        next: translateText => {
          this.errorTableConfig.set(translateText);
        }
      });
  }
  //инициализация поисковых объектов
  private initDefaultValue() {
    if (this.currentSearchObjectUse() === SearchObjectUseEnum.OUTER) {
      this.searchObject.set(this.searchObjectInput());
      this.objectList.set([...this.objectListInput()]);
    } else {
      const defSortColumnInner = this.DEFAULT_SORT_COLUMN_INNER();
      const searchObjectInner = new BaseSearch(defSortColumnInner, DEFAULT_SORT_DIRECTION_INNER);
      this.searchObject.set(searchObjectInner);
      const sortedObjectList = SearchConfig.sortObjectsOnNumberOrStringField(
        this.objectListInput(), defSortColumnInner, DEFAULT_SORT_DIRECTION_INNER);
      this.objectList.set([...sortedObjectList]);
    }
  }
  //подписка на изменение поискового объекта
  private _getSearchSubject() {
    this.searchSubject
      .pipe(
        debounceTime(DELAY_TIME_SORT),
        distinctUntilChanged((previous, current) =>
          previous.sortColumn === current.sortColumn &&
          previous.sortDirection === current.sortDirection &&
          previous.pageNumber === current.pageNumber ),
        takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(searchObjectTmp => {
        if (this.currentSearchObjectUse() === SearchObjectUseEnum.OUTER) {
          const sortAndPageFields: SortAndPageFields = {
            pageNumber: searchObjectTmp.pageNumber,
            sortColumn: searchObjectTmp.sortColumn,
            sortDirection: searchObjectTmp.sortDirection
          };
          this.searchObjectChange.emit(sortAndPageFields);
        }
        else {
          const sortedObjectList = SearchConfig.sortObjectsOnNumberOrStringField(
            this.objectListInput(), searchObjectTmp.sortColumn, searchObjectTmp.sortDirection)
          this.objectList.set([...sortedObjectList]);
        }
      });
  }
  //подписка на получение текущего языка
  private _getCurrentLanguage() {
    this.seService.getCurrentLanguage()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentLanguage => {
        if (currentLanguage) this.currentLanguage = currentLanguage;
      });
  }
  //сортировка таблицы с переходом на первую страницу
  onSort(field: string) {
    const searchObject = this.searchObject();
    if (!searchObject) return;

    const newSortParams = this.calculateNewSortParams(field, searchObject.sortColumn, searchObject.sortDirection);
    const searchObjectUpdate: S | BaseSearch = {...searchObject,
      sortColumn: newSortParams.sortColumn,
      sortDirection: newSortParams.sortDirection,
      pageNumber: DEFAULT_PAGE_NUMBER};
    this.searchObject.set(searchObjectUpdate);
    this.searchSubject.next(searchObjectUpdate);
  }
  //расчет новых параметров для сортировки
  calculateNewSortParams(newField: string, oldField: string, currentDirection: SortDirectionEnum) {
    const currentSearchObjectUse = this.currentSearchObjectUse();
    if (newField !== oldField) {
      return {
        sortColumn: newField,
        sortDirection: this.calculateNewSortDirection(currentSearchObjectUse, SortDirectionEnum.NULL)
      }
    }

    const newSortDirection = this.calculateNewSortDirection(currentSearchObjectUse, currentDirection);
    if (newSortDirection === SortDirectionEnum.NULL) {
      return {
        sortColumn: this.getDefaultSortColumn(currentSearchObjectUse),
        sortDirection: this.getDefaultSortDirection(currentSearchObjectUse)
      }
    }

    return {
      sortColumn: newField,
      sortDirection: newSortDirection
    }
  }
  //получить стандартную колонку для сортировки
  private getDefaultSortColumn(searchObjectUseEnum: SearchObjectUseEnum): string {
    return searchObjectUseEnum === SearchObjectUseEnum.OUTER
      ? DEFAULT_SORT_COLUMN : this.DEFAULT_SORT_COLUMN_INNER();
  }
  //получить стандартное направление для сортировки
  private getDefaultSortDirection(searchObjectUseEnum: SearchObjectUseEnum): SortDirectionEnum {
    return searchObjectUseEnum === SearchObjectUseEnum.OUTER
      ? DEFAULT_SORT_DIRECTION : DEFAULT_SORT_DIRECTION_INNER;
  }
  //расчет нового направления сортировки
  calculateNewSortDirection(currentSearchObjectUse: SearchObjectUseEnum, currentDirection: SortDirectionEnum) {
    return currentSearchObjectUse === SearchObjectUseEnum.OUTER ?
      SearchConfig.changeSortDirectionDAN(currentDirection) : SearchConfig.changeSortDirectionADN(currentDirection);
  }
  //выбор и отмена выбора объекта в таблице
  onSelectObject(object: T) {
    clearTimeout(this.timeoutDBLClickId);
    this.timeoutDBLClickId = setTimeout(() => {
      this.outputSelectedObject(object);
    }, DELAY_TIME_DBLCLICK);
  }
  //выбор и открытие на просмотр элемента в таблице
  onViewAndSelectObject(object: T) {
    clearTimeout(this.timeoutDBLClickId);
    this.outputSelectedObject(object, true);
  }
  //перемещаемся на строку выше
  moveRowFocusUp(index: number) {
    if (index > 0) {
      this.changeRowFocus(index - 1);
    }
  }
  //перемещаемся на строку ниже
  moveRowFocusDown(index: number) {
    if (index < this.rowList().length-1) {
      this.changeRowFocus(index + 1);
    }
  }
  //фокусируемся на нужной строке
  changeRowFocus(index: number) {
    const row = this.rowList()[index].nativeElement;
    row.focus();
  }
  //передача выбранного объекта в родительский компонент
  private outputSelectedObject(object: T, isShow: boolean = false, isContextMenu: boolean = false) {
    this.selectedObjectOutput.emit(new TableSelectedStore(object, isShow, isContextMenu));
  }
  //получение необходимых классов для строки в tbody
  getRowClasses(object: T, selectedObject: T | null) {
    const classes = [];
    const colorClass = this.getColorClass(object);
    if (colorClass) classes.push(colorClass);
    if (object.id === selectedObject?.id) classes.push('active');
    return classes.join(' ');
  }
  //получение необходимого класса с цветом фона при выполнении условий
  getColorClass(object: T) {
    const colorByConditionListInput = this.colorByConditionListInput();
    if (!colorByConditionListInput?.length) return null;

    const matchingCondition = colorByConditionListInput
      .find(cbc => this.matchesCondition(object[cbc.fieldName], cbc.fieldValue));

    return matchingCondition?.colorClassName ?? null;
  }
  //проверка совпадения условия
  private matchesCondition(value: any, expected: string | number | boolean) {
    if (SharedChecker.isString(value) && SharedChecker.isString(expected)) return value.includes(expected);
    if (SharedChecker.isNumber(value) && SharedChecker.isNumber(expected)) return value === expected;
    if (SharedChecker.isBoolean(value) && SharedChecker.isBoolean(expected)) return value === expected;
    return false;
  }
  //получение отображаемого текста в ячейке
  getTextForCell(value: any): string {
    if (SharedChecker.isNull(value) || SharedChecker.isUndefined(value)) return '';
    if (SharedChecker.isBoolean(value)) return value ? 'Да' : 'Нет';//todo можно добавить перевод в будущем
    if (SharedChecker.isDate(value)) return value.toLocaleDateString(this.currentLanguage, {day: '2-digit', month: '2-digit', year: 'numeric'});
    return String(value);
  }
  //подать сигнал о необходимости заново загрузить данные таблицы
  onReloadTable() {
    this.reloadTable.emit();
  }
  //показываем контекстное меню
  onShowContextMenu(event: MouseEvent, object: T) {
    //если шаблона своего контекстного меню нет, то отображаем стандартное
    if (!this.contextMenuTemplate()) return;

    event.preventDefault();//останавливаем стандартное событие вообще
    this.outputSelectedObject(object, false, true);//отправляем выбранный объект родителю
    this.positionContextMenuX.set(event.clientX - 5);//получаем начальную позицию отображения контекстного меню
    this.positionContextMenuY.set(event.clientY - 5);//смещенного влево и наверх на 5 px
    this.showContextMenu.set(true);//разрешаем показать контекстное меню
  }
  //скрываем контекстное меню
  onHiddenContextMenu() {
    this.showContextMenu.set(false);
  }

  protected readonly UserRoleAppEnum = UserRoleAppEnum;
}


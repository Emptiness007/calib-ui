import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  SecurityContext,
  signal,
  untracked
} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {TranslatePipe} from '@ngx-translate/core';
import {NotificationService} from '../notifications/notification.service';
import {ABase} from '../../../model/dto/a-base';
import {TextT} from '../../../translate/translate.config';
import {SharedChecker} from '../../../shared-constant.config';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'avi-select-search',
  imports: [
    NgbDropdown,
    TranslatePipe,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownToggle
  ],
  templateUrl: './select-search.html',
  styleUrl: './select-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSearch<D extends ABase> {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly nService = inject(NotificationService);

  readonly uniqId = input.required<string>();//уникальный ИД (обязательно)
  readonly translateKey = input.required<string>();//ключ для перевода (обязательно) //todo потом добавить возможность без перевода что-то писать
  readonly fieldName = input.required<string>();//имя поля (обязательно)
  readonly itemList = input.required<D[] | string[] | number[]>();//список элементов (обязательно)
  readonly selectedItemInList = input<D | string | number | null>(null);//выбранное значение из списка
  readonly placeholder = input<string>('');//надпись внутри input, если нет значения //todo потом переделать на перевод
  readonly isDisabled = input<boolean>(false);//заблокирован ли элемент
  readonly isSmall = input<boolean>(false);//размер маленький
  readonly isLarge = input<boolean>(false);//размер большой
  readonly isReadOnly = input<boolean>(false);//блокировать ввод
  readonly isRequired = input<boolean>(false);//обязательно ли для заполнения

  selectedItemChange = output<D | string | number | null>();//выбранный элемент из select

  readonly selectedItem = signal<D | string | number | null>(null);
  readonly filterSomeList = computed(() => {
    const itemList = this.itemList();
    console.log(this.itemList());
    const selectedItem = this.selectedItem()?.toString().toLowerCase();
    console.log(selectedItem)
    if (!selectedItem || this.isReadOnly()) return itemList;
    console.log(itemList)
    return itemList.filter(item => item.toString().toLowerCase().includes(selectedItem));
  });
  readonly correctId = computed(() => `${this.fieldName()}-${this.uniqId()}`);//корректный input id
  readonly correctTranslateKey = computed(() => {
    const tKey = this.translateKey().trim();
    const normalizedKey = tKey.endsWith('.') ? tKey : tKey + '.';
    return `${normalizedKey}${this.fieldName()}`.toUpperCase();
  });//корректный ключ для перевода
  readonly sizeIsWrong = computed(() => this.isSmall() && this.isLarge());//правильно ли указан размер
  readonly sizeClass = computed(() => {
    const small = this.isSmall();
    const large = this.isLarge();
    const sizeIsWrong = this.sizeIsWrong();
    if (sizeIsWrong) return '';
    return small ? 'input-group-sm' : (large ? 'input-group-lg' : '');
  });//класс для размера input
  readonly requiredSuffix = computed(() => this.isRequired() ? '*' : '');//дописка в конце label

  constructor() {
    effect(() => {
      const sizeIsWrong = this.sizeIsWrong();
      if (sizeIsWrong) untracked(() => this.nService.showNegative(new TextT('SHARED.INPUT.FORM-CONTROL-SIZE-IS-WRONG', this.correctId())));
    });
    effect(() => {
      const selectedItem = this.selectedItemInList();
      this.selectedItem.set(selectedItem);
    });
  }
  //фильтрация списка по введенной строке
  onFilter(event: Event) {
    this.selectedItem.set((event.target as HTMLInputElement).value);
  }
  //подсветка текста фильтрации в списке
  highlightText(item: D | string | number, filter: D | string | number | null) {
    if (!filter) return item;
    try {
      const text = item.toString();
      const escapedFilter = filter.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedFilter})`, 'gi');
      const htmlText = text.replace(regex, '<mark class="p-0">$1</mark>');
      return this.sanitizer.sanitize(SecurityContext.HTML, htmlText) || '';
    } catch {
      return item;
    }
  }
  //проверка списка объектов по полю id(если оно есть) остальные как есть
  trackById(item: D | string | number) {
    return item && typeof item === 'object' ? item.id : item;
  }
  //выбор элемента из списка, либо null при очистке
  onSelectDdmItem(selectedObject: D | string | number | null) {
    const selectedObjectTmp = this.selectedItemInList();
    this.selectedItem.set(selectedObjectTmp);
    if (SharedChecker.isEqual(selectedObjectTmp, selectedObject)) return;
    this.selectedItemChange.emit(selectedObject);
  }
}

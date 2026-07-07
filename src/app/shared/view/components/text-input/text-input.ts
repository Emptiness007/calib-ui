import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, untracked} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {NotificationService} from '../notifications/notification.service';
import {TextT} from '../../../translate/translate.config';
import {DEFAULT_ND, DEFAULT_NT, EmptyInputEnum, SharedChecker} from '../../../shared-constant.config';

@Component({
  selector: 'avi-text-input',
  imports: [
    TranslatePipe
  ],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput {
  protected readonly EmptyInputEnum = EmptyInputEnum;
  protected readonly DEFAULT_ND = DEFAULT_ND;
  protected readonly DEFAULT_NT = DEFAULT_NT;

  private readonly nService = inject(NotificationService);//подключаем сервис для уведомлений
  readonly uniqId = input.required<string>();//уникальный ИД (обязательно)
  readonly translateKey = input.required<string>();//ключ для перевода (обязательно) //todo потом добавить возможность без перевода что-то писать
  readonly fieldName = input.required<string>();//имя поля (обязательно)
  readonly fieldValue = input<string | null>(null);//значение поля
  readonly placeholder = input<string>('');//надпись внутри input, если нет значения //todo потом переделать на перевод
  readonly isDisabled = input<boolean>(false);//заблокирован ли элемент
  readonly isSmall = input<boolean>(false);//размер маленький
  readonly isLarge = input<boolean>(false);//размер большой
  readonly isRequired = input<boolean>(false);//обязательно ли для заполнения
  readonly isTextArea = input<boolean>(false);//обязательно ли для заполнения
  readonly optionalButtons = input<EmptyInputEnum[]>([]);//обязательно ли для заполнения

  fieldValueChange = output<string | null>();//введенное число в поле input

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
  readonly requiredSuffix = computed(() => this.isRequired() ? '*' : '');
  readonly buttonStates = computed(() => ({
    isNT: this.optionalButtons().includes(EmptyInputEnum.NT),
    isND: this.optionalButtons().includes(EmptyInputEnum.ND)
  }))

  constructor() {
    effect(() => {
      const sizeIsWrong = this.sizeIsWrong();
      if (sizeIsWrong) untracked(() => this.nService.showNegative(new TextT('SHARED.INPUT.FORM-CONTROL-SIZE-IS-WRONG', this.correctId())));
    });
  }
  //обрабатываем вводимые значения
  inputValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onFieldValueChange(SharedChecker.isEmptyString(value) ? null : value);
  }
  //отправляем родителю введенное число или null
  onFieldValueChange(value: string | null) {
    if (!SharedChecker.isEqual(this.fieldValue(), value))
      this.fieldValueChange.emit(value);
  }
}

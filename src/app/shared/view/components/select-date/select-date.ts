import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, untracked} from '@angular/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {TranslatePipe} from '@ngx-translate/core';
import {NotificationService} from '../notifications/notification.service';
import {TextT} from '../../../translate/translate.config';
import {SharedChecker} from '../../../shared-constant.config';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'avi-select-date',
  imports: [
    TranslatePipe,
    NgbInputDatepicker,
    FormsModule
  ],
  templateUrl: './select-date.html',
  styleUrl: './select-date.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDate {
  private readonly nService = inject(NotificationService);//подключаем сервис для уведомлений

  readonly uniqId = input.required<string>();//уникальный ИД (обязательно)
  readonly translateKey = input.required<string>();//ключ для перевода (обязательно) //todo потом добавить возможность без перевода что-то писать
  readonly fieldName = input.required<string>();//имя поля (обязательно)
  readonly fieldValue = input<Date | null>(null);//значение поля
  readonly isDisabled = input<boolean>(false);//заблокирован ли элемент
  readonly isSmall = input<boolean>(false);//размер маленький
  readonly isLarge = input<boolean>(false);//размер большой
  readonly isRequired = input<boolean>(false);//обязательно ли для заполнения

  fieldValueChange = output<Date | null>();//введенное число в поле input

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
      if (sizeIsWrong) untracked(() =>
        this.nService.showNegative(new TextT('SHARED.INPUT.FORM-CONTROL-SIZE-IS-WRONG', this.correctId())));
    });
  }

  onFieldValueChange(value: Date | null) {
    if (!SharedChecker.isEqual(this.fieldValue(), value))
      this.fieldValueChange.emit(value);
  }
}

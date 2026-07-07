import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, untracked} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {NotificationService} from '../notifications/notification.service';
import {TextT} from '../../../translate/translate.config';
import {SharedChecker} from '../../../shared-constant.config';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'avi-checkbox-input',
  imports: [
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './checkbox-input.html',
  styleUrl: './checkbox-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInput {
  private readonly nService = inject(NotificationService);

  readonly uniqId = input.required<string>();//уникальный ИД (обязательно)
  readonly translateKey = input.required<string>();//ключ для перевода (обязательно)
  readonly fieldName = input.required<string>();//имя поля (обязательно)
  readonly fieldValue = input<boolean | null>(null);//значение поля
  readonly isDisabled = input<boolean>(false);//заблокирован ли элемент
  readonly isRequired = input<boolean>(false);//обязательно ли для заполнения

  fieldValueChange = output<boolean | null>();//введенное значение в checkbox

  readonly correctId = computed(() => `${this.fieldName()}-${this.uniqId()}`);//корректный input id
  readonly correctTranslateKey = computed(() => {
    const tKey = this.translateKey().trim();
    const normalizedKey = tKey.endsWith('.') ? tKey : tKey + '.';
    return `${normalizedKey}${this.fieldName()}`.toUpperCase();
  });//корректный ключ для перевода
  readonly requiredSuffix = computed(() => this.isRequired() ? '*' : '');//дописка в конце label

  //отправляем родителю введенное значение
  onFieldValueChange(value: boolean) {
    if (!SharedChecker.isEqual(this.fieldValue(), value)) {
      this.fieldValueChange.emit(value);
    }
  }
}

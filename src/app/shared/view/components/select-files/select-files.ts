import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked
} from '@angular/core';
import {NotificationService} from '../notifications/notification.service';
import {TextT} from '../../../translate/translate.config';
import {TranslatePipe} from '@ngx-translate/core';
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'avi-select-files',
  imports: [
    TranslatePipe,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu
  ],
  templateUrl: './select-files.html',
  styleUrl: './select-files.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFiles {
  private readonly nService = inject(NotificationService);
  readonly uniqId = input.required<string>();//уникальный ИД (обязательно)
  readonly translateKey = input.required<string>();//ключ для перевода (обязательно) //todo потом добавить возможность без перевода что-то писать
  readonly fieldName = input.required<string>();//имя поля (обязательно)
  readonly fileList = input<any[] | null>(null);//список файлов
  readonly isDisabled = input<boolean>(false);//заблокирован ли элемент
  readonly isSmall = input<boolean>(false);//размер маленький
  readonly isLarge = input<boolean>(false);//размер большой
  readonly isRequired = input<boolean>(false);//обязательно ли для заполнения
  readonly isMultiple = input<boolean>(false);//множественный выбор
  readonly maxSize = input<number>(1024 * 1024 * 1024);//максимальный размер файла (1Гб), передавать размер в байтах
  readonly acceptedFileTypeList = input<string[]>([]);//типы файлов для выбора

  fileListChange = output<File[] | null>();//список выбранных файлов

  readonly correctId = computed(() => `${this.fieldName()}-${this.uniqId()}`);//корректный input id
  readonly correctTranslateKey = computed(() => {
    const tKey = this.translateKey().trim();
    const normalizedKey = tKey.endsWith('.') ? tKey : tKey + '.';
    return `${normalizedKey}${this.fieldName()}`.toUpperCase();
  });
  readonly fileListCount = computed(() => this.fileList()?.length ?? 0);
  //корректный ключ для перевода
  readonly fileName = computed(() => {
    const list = this.fileList();
    if (list && list.length > 0) {
      return list[0].name;
    }
    return '';
  });
  readonly sizeIsWrong = computed(() => this.isSmall() && this.isLarge());//правильно ли указан размер
  readonly sizeClass = computed(() => {
    const small = this.isSmall();
    const large = this.isLarge();
    const sizeIsWrong = this.sizeIsWrong();
    if (sizeIsWrong) return '';
    return small ? 'input-group-sm' : (large ? 'input-group-lg' : '');
  });//класс для размера input
  readonly requiredSuffix = computed(() => this.isRequired() ? '*' : '');//дописка в конце label
  readonly isValid = computed(() => this.isRequired() && this.fileName() !== '');
  readonly dragActive = signal<boolean>(false);

  constructor() {
    effect(() => {
      const sizeIsWrong = this.sizeIsWrong();
      if (sizeIsWrong) untracked(() => this.nService.showNegative(new TextT('SHARED.INPUT.FORM-CONTROL-SIZE-IS-WRONG', this.correctId())));
    });
  }
  //обработка перетаскивания файлов в поле input
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.set(true);
  }
  //обработка выхода за пределы элемента при перетаскивании файлов
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.set(false);
  }
  //обработка отпускания файлов после перетаскивания в поле input
  onDrop(event: DragEvent) {
    if (this.isDisabled()) return;
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.set(false);
    const itemList = event.dataTransfer?.items ?? [];
    let fileList: File[] = [];
    for (let item of itemList) {
      if (item.kind === 'file' && item.webkitGetAsEntry()?.isFile) {
        const file = item.getAsFile();
        if (file) fileList.push(file);
      }
    }
    this.outputSelectedFileList(fileList);
  }
  //сбрасываем выбранный файл и открываем окно выбора файлов
  onTriggerSelectFileList(inputFiles: HTMLInputElement) {
    inputFiles.value = '';
    inputFiles.click();
  }
  //выбор файлов
  onSelectFiles(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    const arrayFromFileList = fileList ? Array.from(fileList) : null;
    this.outputSelectedFileList(arrayFromFileList);
  }
  //проверка и отсылка файлов родителю
  outputSelectedFileList(fileList: File[] | null) {
    this.dragActive.set(false);
    if (fileList && fileList.length > 0 && this.validateFileList(fileList))
      this.fileListChange.emit(fileList);
    else this.fileListChange.emit(null);
  }
  //проверка файлов
  private validateFileList(fileList: File[]) {
    if (!this.isMultiple() && fileList.length > 1) {
      this.nService.showWarning(new TextT('SHARED.INPUT.FILE-NOT-ONE'));
      return false;
    }

    const acceptedFileTypes = this.acceptedFileTypeList().toString();
    const incorrectExtension = fileList.some(file => {
      const fileExtension = file.name.trim().toLowerCase().split('.').pop() ?? '';
      return acceptedFileTypes && !acceptedFileTypes.toLowerCase().includes(fileExtension);
    });
    if (incorrectExtension) {
      this.nService.showWarning(new TextT('SHARED.INPUT.FILE-INCORRECT-EXTENSION', acceptedFileTypes));
      return false;
    }

    const maxSize = this.maxSize();
    const tooLarge = fileList.some(file => file.size > maxSize);
    if (tooLarge) {
      const sizeMb = Math.round(maxSize / (1024 * 1024) * 10) / 10;
      this.nService.showWarning(new TextT('SHARED.INPUT.FILE-TOO-LARGE', sizeMb.toString()));
      return false;
    }

    return true;
  }
}

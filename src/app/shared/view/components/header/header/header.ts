import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {TranslatePipe} from '@ngx-translate/core';
import {DEFAULT_THEME, DEFAULT_THEME_ICON, ThemeConfig, ThemeEnum, ThemeIconEnum} from '../../../../theme/theme.config';
import {ROLE_UNDEFINED, USER_UNDEFINED} from '../../../../auth/auth.config';
import {NgTemplateOutlet} from '@angular/common';
import {UserStore} from '../../../../auth/model/store/user-store';
import {RoleStore} from '../../../../auth/model/store/role-store';
import {HolidayEnum} from '../../../../holiday/holiday.config';
import {Garland} from '../../garland/garland/garland';
import {HolidayService} from '../../../../holiday/holiday.service';
import {environment} from '../../../../../../environments/environment';
import {Clock} from '../../../../clock/clock/clock';
import {SharedEventsService} from '../../../../service/shared-events.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DEFAULT_ATTENTION_BELL_LOGO_SIZE} from '../header.config';
import {TextT} from '../../../../translate/translate.config';
import {SharedTranslateService} from '../../../../translate/shared-translate.service';
import {SharedDialogsService} from '../../../../open-dialog/shared-dialogs.service';
import {DialogResultEnum} from '../../../../open-dialog/dialog.config';
import {SharedFileService} from '../../../../service/shared-file.service';
import {CURRENT_APP_VERSION} from '../../../../../app.constant.config';
import {InstructionStore} from '../../../../model/store/instruction-store';
import {DEFAULT_APP_VERSION} from '../../../../shared-constant.config';

@Component({
  selector: 'avi-header',
  imports: [
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    TranslatePipe,
    NgbDropdownItem,
    NgTemplateOutlet,
    Garland,
    Clock
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'disable-highlight-text'}
})
export class Header {
  private readonly holidayService = inject(HolidayService);
  private readonly seService = inject(SharedEventsService);
  private readonly sfService = inject(SharedFileService);
  private readonly sdService = inject(SharedDialogsService);
  private readonly stService = inject(SharedTranslateService);
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);

  readonly appName = signal<string | null>(null);
  readonly instruction = signal<InstructionStore | null>(null);
  readonly currentAppVersion = signal(CURRENT_APP_VERSION);
  readonly userAppVersion = signal(DEFAULT_APP_VERSION);
  readonly currentAppRoleList = computed(()=> this.currentUser().roleSetForApp);
  readonly currentRole = signal<RoleStore | null>(ROLE_UNDEFINED);
  readonly currentUser = signal<UserStore>(USER_UNDEFINED);
  readonly currentAppTheme = signal(DEFAULT_THEME);
  readonly currentAppThemeIcon = signal(DEFAULT_THEME_ICON);
  readonly showNewsAttention = computed(() => this.currentAppVersion() !== this.userAppVersion());

  readonly attentionBellLogoSize = DEFAULT_ATTENTION_BELL_LOGO_SIZE;
  readonly currentHoliday = this.holidayService.getCurrentHolidayValue();

  constructor() {
    this._getAppName();
    this._getInstructionConfig();
    this._getCurrentUser();
    this._getCurrentRole();
    this._getCurrentAppVersion();
    this._getUserAppVersion();
    this._getCurrentTheme();
  }
  //подписка на получение наименования приложения
  _getAppName() {
    this.seService.getAppName()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(appName => {
        this.setAppName(appName);
      });
  }
  //подписка на получение наименования вкладки для инструкции
  _getInstructionConfig() {
    this.seService.getInstruction()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(instruction => {
        this.instruction.set(instruction);
      });
  }
  //подписка на получение пользователя
  _getCurrentUser() {
    this.seService.getCurrentUser()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentUser => {
        if (currentUser)
          this.currentUser.set(currentUser);
      });
  }
  //подписка на получение роли
  _getCurrentRole() {
    this.seService.getCurrentRole()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentRole => {
        if (currentRole)
          this.currentRole.set(currentRole);
      });
  }
  //подписка на получение текущей версии сайта
  _getCurrentAppVersion(){
    this.seService.getCurrentAppVersion()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentAppVersion => {
        if (currentAppVersion)
          this.currentAppVersion.set(currentAppVersion);
      });
  }
  //подписка на получение текущей версии сайта
  _getUserAppVersion(){
    this.seService.getUserAppVersion()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(userAppVersion => {
        if (userAppVersion)
          this.userAppVersion.set(userAppVersion);
      });
  }
  //подписка на получение текущей темы сайта
  _getCurrentTheme() {
    this.seService.getCurrentAppTheme()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentAppTheme => {
        if (currentAppTheme) {
          this.currentAppTheme.set(currentAppTheme);
          this.currentAppThemeIcon.set(ThemeIconEnum[ThemeConfig.getEnumKeyFromValue(ThemeEnum, currentAppTheme)]);
        }
      });
  }

  //установка наименования сайта
  setAppName(text: TextT | string) {
    this.stService.getTranslateText(text)
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(translateText => {
        this.appName.set(translateText);
      });
  }
  //проверка на то, что сейчас новый год
  holidayIsNY() {
    return this.currentHoliday === HolidayEnum.NEW_YEAR;
  }
  //проверка на то, что проект собран и запущен в режиме prod
  appIsProd() {
    return !environment.production;
  }
  //нажали сбросить локальное хранилище для текущего пользователя
  onResetLS() {
    this.seService.setFlagResetLS();
  }

  //получение названия роли
  getRoleViewName(role: RoleStore) {
    return role.viewName!.split(':').at(-1);
  }
  // Выбор роли из списка
  onSelectRole(event: any): void {
    const role = this.currentAppRoleList().find(role => role.id === Number(event.target.value))!;
    this.seService.setCurrentRole(role);
  }

  //сменить тему сайта
  onChangeTheme(): void {
    switch (this.currentAppTheme()) {
      case ThemeEnum.LIGHT:
        this.seService.setCurrentAppTheme(ThemeEnum.STANDARD);
        break;
      case ThemeEnum.DARK:
        this.seService.setCurrentAppTheme(ThemeEnum.LIGHT);
        break;
      default:
        this.seService.setCurrentAppTheme(ThemeEnum.DARK);
          break;
    }
  }

  //смена пользователя (разлогивание)
  onChangeUser() {
    this.sdService.openConfirmNegativeDialog(
      new TextT('SHARED.DIALOG.CONFIRM.CHANGE-USER'),
      new TextT('SHARED.DIALOG.CONFIRM.CHANGE-USER-TEXT'),
      new TextT('SHARED.BUTTON.CHANGE-USER'))
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(result => {
        if (result.result === DialogResultEnum.CONFIRM || result.result === DialogResultEnum.ACCEPT)
          this.seService.setFlagChangeUser();
      });
  }
  //открыть окно Новости
  onOpenNewsDialog() {
    this.sdService.openNewsDialog()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(() => {
        this.seService.setUserAppVersion(this.currentAppVersion());
      });
  }
  //открыть окно Настройки
  onOpenSettingsDialog() {
    this.sdService.openSettingsDialog()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(result => {
        this.seService.setFlagCloseSettings(result);
      });
  }
  //открыть инструкцию
  onOpenInstruction() {
    const instruction = this.instruction();
    if (instruction)
      this.sfService.openInstructionPdfFile(instruction.filePath, instruction.tabName);
  }
  //открыть окно о приложении
  onOpenAboutDialog() {
    this.sdService.openAboutDialog();
  }
  //нажали на выход из приложения
  onExitApp() {
    this.sdService.openConfirmNegativeDialog(
      new TextT('SHARED.DIALOG.CONFIRM.EXIT-APP'),
      new TextT('SHARED.DIALOG.CONFIRM.EXIT-APP-TEXT'),
      new TextT('SHARED.BUTTON.EXIT'))
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(result => {
        if (result.result === DialogResultEnum.CONFIRM || result.result === DialogResultEnum.ACCEPT)
          this.seService.setFlagExitApp();
      });
  }
}

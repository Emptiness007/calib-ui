import {
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  signal,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {SharedEventsService} from '../service/shared-events.service';
import {RoleStore} from './model/store/role-store';
import {ROLE_UNDEFINED, UserRoleAppEnum} from './auth.config';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SharedChecker} from '../shared-constant.config';

@Directive({
  selector: '[aviAuthAccess]'
})
export class AuthAccessDirective {
  private readonly unsubscribeAfterDestroy = inject(DestroyRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef);
  private readonly seService = inject(SharedEventsService);

  readonly accessRoleList = input<string | string[] | undefined>(undefined, {alias: 'aviAuthAccess'});
  private readonly isShow = signal(false);

  private readonly currentRole = signal<RoleStore>(ROLE_UNDEFINED);

  private readonly accessAllowed = computed(() => {
    const role = this.currentRole();
    if(!role.name) return false;
    if(role.name === UserRoleAppEnum.MAINTAINER) return true;
    if(role.name === UserRoleAppEnum.VIEW) return false;
    const inputRoleList = this.accessRoleList();
    const accessRoleList = SharedChecker.isArray(inputRoleList) ? inputRoleList : [inputRoleList];
    return accessRoleList.includes(role.name);
  })

  constructor() {
    this._getCurrentRole();
    effect(() => {
      const accessAllowed = this.accessAllowed();
      this.updateView(accessAllowed);
    });
  }

  //подписка на получение текущей роли
  private _getCurrentRole() {
    this.seService.getCurrentRole()
      .pipe(takeUntilDestroyed(this.unsubscribeAfterDestroy))
      .subscribe(currentRole => {
        if (currentRole) {
          this.currentRole.set(currentRole);
        }
      });
  }

  private updateView(accessAllowed: boolean) {
    if(accessAllowed && !this.isShow()) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.isShow.set(true);
    } else if (!accessAllowed && this.isShow()) {
      this.viewContainerRef.clear();
      this.isShow.set(false);
    }
  }
}

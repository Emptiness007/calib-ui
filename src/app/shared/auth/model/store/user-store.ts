import {UserDTO} from '../dto/user-dto';
import {UserRoleAppEnum} from '../../auth.config';
import {Expose, Transform} from 'class-transformer';
import {RoleStore} from './role-store';

export class UserStore extends UserDTO {
  @Expose({toClassOnly: true})
  @Transform(({obj}) => obj.getFullName())
  fullName: string;
  @Expose({toClassOnly: true})
  @Transform(({obj}) => obj.getFullName(true))
  fullNameShort: string;
  @Expose({toClassOnly: true})
  @Transform(({obj}) => obj.getLSName())
  lsName: string;
  @Expose({toClassOnly: true})
  @Transform(({obj}) => obj.getRoleListForThisProgramme())
  roleSetForApp: RoleStore[];

  //преобразование строки только с первой заглавной буквой
  private capitalizeFirst(str: string | null | undefined, isShort = false) {
    if (!str) return '';
    return isShort ? str.charAt(0).toUpperCase() + '.' : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  //получаем полное ФИО в одной переменной
  private getFullName(isShort = false) {
    if (!this.firstName || !this.lastName) return 'invalid data for full name';
    return `${this.capitalizeFirst(this.firstName, isShort)} ${this.capitalizeFirst(this.lastName, isShort)} ${this.capitalizeFirst(this.patronymicName, isShort)}`;
  }
  //получаем имя для локального хранилища
  private getLSName() {
    if (!this.id || !this.firstName || !this.lastName) return 'invalid data for ls name';
    return this.id + this.firstName.toLowerCase() + this.lastName.toLowerCase();
  }
  //получаем список ролей для текущего приложения
  private getRoleListForThisProgramme() {
    if (!this.roleSet || this.roleSet.length == 0) return [];
    return this.roleSet.filter((role) => Object.values(UserRoleAppEnum).includes(role.name as UserRoleAppEnum));
  }

  constructor(id: number, firstName: string, lastName: string, patronymicName: string, roleSet: RoleStore[]) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.patronymicName = patronymicName;
    this.roleSet = roleSet;
    this.fullName = this.getFullName();
    this.fullNameShort= this.getFullName(true);
    this.lsName = this.getLSName();
    this.roleSetForApp = this.getRoleListForThisProgramme();
  }
}

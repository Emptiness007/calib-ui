import {ABase} from '../../../model/dto/a-base';
import {Expose} from 'class-transformer';
import {RoleStore} from '../store/role-store';

export class UserDTO extends ABase {
  @Expose()
  firstName?: string;//Фамилия
  @Expose()
  lastName?: string;//Имя
  @Expose()
  patronymicName?: string;//Отчество
  @Expose()
  email?: string;//почта
  @Expose()
  description?: string;//описание
  @Expose()
  roleSet?: RoleStore[];//выданные роли пользователя (Все)

  @Expose()
  password?: string;//пароль (не передается с сервера, только от клиента к серверу, например, при обновлении)
}

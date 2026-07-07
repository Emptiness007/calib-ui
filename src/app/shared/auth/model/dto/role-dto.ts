import {ABase} from '../../../model/dto/a-base';
import {Expose} from 'class-transformer';
import {UserRoleAppEnum} from '../../auth.config';

export class RoleDTO extends ABase {
  @Expose()
  name?: UserRoleAppEnum;//наименование роли
  @Expose()
  viewName?: string;//отображаемое наименование роли
  @Expose()
  description?: string;//описание
}

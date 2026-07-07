import {RoleDTO} from '../dto/role-dto';
import {UserRoleAppEnum} from '../../auth.config';

export class RoleStore extends RoleDTO {
  constructor(id: number, name: UserRoleAppEnum, viewName: string, description?: string) {
    super();
    this.id = id;
    this.name = name;
    this.viewName = viewName;
    this.description = description;
  }
}

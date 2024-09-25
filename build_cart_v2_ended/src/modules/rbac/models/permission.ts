import {
  Table,
  Column,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { RolePermission } from './role-permision.model';
import { Role } from './role.model';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { Resource } from './resource.model';
import PermissionResource from './permission-resources.model';

@Table({
  paranoid: true,
})
export class Permission extends BaseModel<Permission> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  createdById: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'createdById',
    as: 'createdBy',
    onDelete: 'SET NULL',
  })
  createdBy?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  updatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'updatedById', onDelete: 'SET NULL' })
  updatedBy?: User;

  @BelongsToMany(() => Role, () => RolePermission)
  roles: Role[];

  @BelongsToMany(() => Resource, () => PermissionResource)
  resources: Resource[];
}

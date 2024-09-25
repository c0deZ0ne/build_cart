import {
  Table,
  Column,
  BelongsToMany,
  BelongsTo,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { Permission } from './permission';
import { RolePermission } from './role-permision.model';
import { UserRole } from './user-role.model';

export enum UserRoles {
  SUPER_ADMIN = 'SUPER ADMIN',
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  PROCUREMENT_MANAGER = 'PROCUREMENT MANAGER',
  SUPPORT_ADMIN = 'SUPPORT ADMIN',
}
@Table({
  paranoid: true,
})
export class Role extends BaseModel<Role> {
  @Column
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

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions: Permission[];

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}

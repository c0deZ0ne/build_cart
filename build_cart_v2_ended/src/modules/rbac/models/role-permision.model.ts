import {
  Table,
  ForeignKey,
  BelongsTo,
  Column,
  DataType,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Permission } from './permission';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class RolePermission extends BaseModel<RolePermission> {
  @ForeignKey(() => Role)
  @Column
  RoleId: string;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Permission)
  @Column
  PermissionId: string;

  @BelongsTo(() => Permission)
  permission: Permission;

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
}

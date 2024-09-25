import {
  Table,
  Column,
  BelongsToMany,
  BelongsTo,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Permission } from './permission';
import PermissionResource from './permission-resources.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class Resource extends BaseModel<Resource> {
  @Column
  name: string;
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  createdById: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'createdById',
    as: 'createdBy',
    onDelete: 'SET NULL',
  })
  createdBy?: User;

  @Column
  referenceId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  updatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'updatedById', onDelete: 'SET NULL' })
  updatedBy?: User;

  @BelongsToMany(() => Permission, () => PermissionResource)
  permissions: Permission[];
}

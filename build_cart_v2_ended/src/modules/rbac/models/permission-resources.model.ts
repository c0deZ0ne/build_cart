import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Resource } from './resource.model';
import { Permission } from './permission';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class PermissionResource extends BaseModel<PermissionResource> {
  @ForeignKey(() => Permission)
  @Column({ type: DataType.UUID })
  PermissionId: string;

  @ForeignKey(() => Resource)
  @Column({ type: DataType.UUID })
  ResourceId: string;

  @BelongsTo(() => Permission, { as: 'permission' })
  permission: Permission;

  @BelongsTo(() => Resource, { as: 'resource' })
  resource: Resource;

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
  updatedBy?: User;
}

export default PermissionResource;

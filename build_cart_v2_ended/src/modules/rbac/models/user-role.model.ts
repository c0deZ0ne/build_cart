import {
  Table,
  ForeignKey,
  BelongsTo,
  Column,
  DataType,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/models/user.model';
import { Role } from './role.model';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
})
export class UserRole extends BaseModel<UserRole> {
  @ForeignKey(() => User)
  @Column
  UserId: string;

  @BelongsTo(() => User, { foreignKey: 'UserId', onDelete: 'CASCADE' })
  user: User;

  @ForeignKey(() => Role)
  @Column
  RoleId: string;

  @BelongsTo(() => Role)
  role: Role;

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

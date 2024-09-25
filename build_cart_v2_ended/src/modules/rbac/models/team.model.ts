import {
  Table,
  ForeignKey,
  BelongsTo,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { TeamMember } from './user-teammembers.model';

@Table({
  paranoid: true,
})
export class Team extends BaseModel<Team> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
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

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  ownerId: string;

  @BelongsTo(() => User, {
    foreignKey: 'ownerId',
    as: 'owner',
    onDelete: 'SET NULL',
  })
  owner: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  updatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'updatedById', onDelete: 'SET NULL' })
  updatedBy?: User;

  @BelongsToMany(() => User, () => TeamMember)
  members: User[];
}

import { DataTypes } from 'sequelize';
import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { Project } from './project.model';
import { ProjectGroup } from './project-group';

@Table({
  paranoid: true,
})
export class GroupName extends BaseModel<GroupName> {
  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Please  provide description here ',
  })
  description?: string | null;

  @Column({
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Please  provide name here ',
  })
  name?: string | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  ownerId?: string | null;

  @BelongsTo(() => User, { foreignKey: 'ownerId', onDelete: 'SET NULL' })
  Owner?: User | null;

  @BelongsToMany(() => Project, () => ProjectGroup)
  projects?: Project[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  createdAt: Date;

  @Column
  migratedAt?: Date | null;

  @Column
  deletedAt: Date | null;

  @Column
  updatedAt: Date | null;
}

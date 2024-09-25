import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Project } from './project.model';
import { GroupName } from './group-name.model';

@Table({
  paranoid: true,
})
export class ProjectGroup extends BaseModel<ProjectGroup> {
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'ProjectId',
    onDelete: 'CASCADE',
  })
  Project?: Project;

  @ForeignKey(() => GroupName)
  @Column({ type: DataType.UUID, allowNull: false })
  GroupNameId: string;

  @BelongsTo(() => GroupName, {
    foreignKey: 'GroupNameId',
    onDelete: 'CASCADE',
  })
  GroupName?: GroupName;

  @Column
  migratedAt: Date | null;

  @Column
  deletedAt: Date | null;

  @Column
  updatedAt: Date | null;
}

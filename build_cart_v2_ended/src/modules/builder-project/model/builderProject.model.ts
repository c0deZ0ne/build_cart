import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Project } from 'src/modules/project/models/project.model';

@Table({
  paranoid: true,
})
export class BuilderProject extends BaseModel<BuilderProject> {
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: true })
  ProjectId?: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'ProjectId',
    onDelete: 'SET NULL',
  })
  Project?: Project | null;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId?: string | null;

  @BelongsTo(() => Builder, {
    foreignKey: 'BuilderId',
    onDelete: 'SET NULL',
  })
  Builder?: Builder | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date | null;

  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById: string | null;

  // @BelongsToMany(() => Project, () => BuilderProject, 'ProjectId', 'BuilderId')
  // projects: Project[];

  migratedAt: Date | null;
}

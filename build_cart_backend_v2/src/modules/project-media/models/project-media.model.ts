import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';

export enum MediaType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

@Table({
  paranoid: true,
})
export class ProjectMedia extends BaseModel<ProjectMedia> {
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, { foreignKey: 'ProjectId' })
  Project?: Project;

  @Column({ type: DataType.STRING, allowNull: true })
  url: string | null;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string | null;

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

  @Column({
    type: DataType.ENUM(...Object.values(MediaType)),
    allowNull: false,
  })
  mediaType: MediaType;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'CreatedById',
    as: 'CreatedBy',
    onDelete: 'SET NULL',
  })
  CreatedBy?: User;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string | null;
  @Column
  migratedAt: Date | null;
}

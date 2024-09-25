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
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { Project } from 'src/modules/project/models/project.model';

@Table({
  paranoid: true,
})
export class ProjectFundManager extends BaseModel<ProjectFundManager> {
  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: false })
  FundManagerId: string;

  @BelongsTo(() => FundManager, {
    foreignKey: 'FundManagerId',
    onDelete: 'CASCADE',
  })
  fundManager?: FundManager;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'ProjectId',
    onDelete: 'CASCADE',
  })
  project?: Project;

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

  migratedAt: Date | null;
}

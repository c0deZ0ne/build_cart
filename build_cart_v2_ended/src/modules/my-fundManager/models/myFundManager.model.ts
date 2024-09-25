import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BaseModel } from 'src/modules/database/base.model';
import { Project } from 'src/modules/project/models/project.model';
import { SharedProject } from 'src/modules/shared-project/models/shared-project.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';

@Table({
  paranoid: true,
})
export class MyFundManager extends BaseModel<MyFundManager> {
  @ForeignKey(() => Builder)
  @Column
  BuilderId: string;

  @BelongsTo(() => Builder, { foreignKey: 'BuilderId', onDelete: 'SET NULL' })
  Builder: Builder;

  @ForeignKey(() => FundManager)
  @Column
  FundManagerId: string;

  @BelongsTo(() => FundManager, {
    foreignKey: 'FundManagerId',
    onDelete: 'SET NULL',
  })
  FundManager: FundManager;

  @ForeignKey(() => Project)
  @Column
  ProjectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'ProjectId',
    onDelete: 'CASCADE',
  })
  Project: Project;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  totalCredited: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  totalSpent: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  balance: number;

  @HasMany(() => SharedProject)
  sharedProjects: SharedProject[];
}

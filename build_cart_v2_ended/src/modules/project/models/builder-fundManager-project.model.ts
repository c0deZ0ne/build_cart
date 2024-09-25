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
export class BuilderFundManager extends BaseModel<BuilderFundManager> {
  @ForeignKey(() => FundManager)
  @Column
  FundManagerId: string;

  @BelongsTo(() => FundManager, {
    foreignKey: 'FundManagerId',
    onDelete: 'SET NULL',
  })
  FundManager: FundManager;

  @ForeignKey(() => Builder)
  @Column
  BuilderId: string;

  @BelongsTo(() => Builder, { foreignKey: 'BuilderId', onDelete: 'SET NULL' })
  Builder: Builder;

  @ForeignKey(() => Project)
  @Column
  ProjectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'ProjectId',
    onDelete: 'CASCADE',
  })
  Project: Project;

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

  // @BelongsToMany(
  //   () => Builder,
  //   () => BuilderFundManager,
  //   'BuilderId',
  //   'FundManagerId',
  // )
  // contractors: Builder[];

  // @BelongsToMany(
  //   () => FundManager,
  //   () => BuilderFundManager,
  //   'FundManagerId',
  //   'BuilderId',
  // )
  // fundManagers: FundManager[];

  migratedAt: Date | null;
}

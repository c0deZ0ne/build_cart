import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';
import { ProjectShares } from '../../project/models/project-shared.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { TenderBid } from '../../project/models/project-tender-bids.model';

export enum TenderStatus {
  ONGOING = 'ONGOING',
  AWARDED = 'AWARDED',
  PAUSED = 'PAUSED',
}

export enum TenderType {
  REQUEST = 'REQUEST',
  INVITE = 'INVITE',
}

@Table({
  paranoid: true,
})
export class ProjectTender extends BaseModel<ProjectTender> {
  @Column({
    type: DataType.ENUM(...Object.values(TenderStatus)),
    defaultValue: TenderStatus.ONGOING,
    allowNull: false,
  })
  status: TenderStatus;
  @Column({
    type: DataType.ENUM(...Object.values(TenderType)),
    defaultValue: TenderType.REQUEST,
    allowNull: false,
  })
  tenderType: TenderType;

  @Column({ type: DataType.BIGINT, allowNull: true, defaultValue: 0 })
  budget: number | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate?: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate?: Date | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logo?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  BOQ?: string | null;

  @Column({ type: DataType.JSONB, defaultValue: [] })
  blacklistedBuilders: string[];

  @Column({ type: DataType.JSONB, defaultValue: [] })
  invitedBuilders: string[];

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  Project: Project;

  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById?: string;

  @BelongsTo(() => User, {
    foreignKey: 'CreatedById',
    as: 'CreatedBy',
    onDelete: 'SET NULL',
  })
  CreatedBy: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  ownerId?: string | null;

  @BelongsToMany(
    () => Builder,
    () => ProjectShares,
    'FundManagerId',
    'BuilderId',
  )
  developers: Builder[];

  @HasMany(() => TenderBid, {
    foreignKey: 'ProjectTenderId',
    onDelete: 'CASCADE',
  })
  TenderBids: TenderBid[];

  @BelongsTo(() => User, {
    foreignKey: 'ownerId',
    onDelete: 'SET NULL',
  })
  Owner?: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById', onDelete: 'SET NULL' })
  UpdatedBy: User | null;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  deletedAt: Date | null;

  @Column
  migratedAt: Date | null;
}

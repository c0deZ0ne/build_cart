import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BaseModel } from 'src/modules/database/base.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';

export enum Status {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

@Table({
  paranoid: true,
})
export class ProjectShares extends BaseModel<ProjectShares> {
  push(cur: ProjectShares) {
    throw new Error('Method not implemented.');
  }
  @Column({
    type: DataType.ENUM(...Object.values(Status)),
    defaultValue: Status.PENDING,
    allowNull: false,
  })
  status: Status;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'ProjectId',
    onDelete: 'CASCADE',
  })
  Project?: Project;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId: string;

  @BelongsTo(() => FundManager, {
    foreignKey: 'FundManagerId',
    onDelete: 'SET NULL',
  })
  fundManager?: FundManager;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string;

  @BelongsTo(() => Builder, { foreignKey: 'BuilderId', onDelete: 'SET NULL' })
  builder?: Builder;

  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById?: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy?: User;

  @Column
  migratedAt: Date | null;

  @Column
  deletedAt: Date | null;
}

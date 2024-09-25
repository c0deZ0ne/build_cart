import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { MediaType } from 'src/modules/project-media/models/project-media.model';
import { Project } from './project.model';
import { ProjectTender } from '../../fund-manager/models/project-tender.model';

export enum BidStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  IN_REVIEW = 'IN_REVIEW',
  CLOSED = 'CLOSED',
}

@Table({
  paranoid: true,
})
export class TenderBid extends BaseModel<TenderBid> {
  @Column({ type: DataType.TEXT, allowNull: true })
  description: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  documents: Array<{ title: string; url: string; type: MediaType }> | null;

  @Column({
    type: DataType.ENUM(...Object.values(BidStatus)),
    defaultValue: BidStatus.PENDING,
    allowNull: false,
  })
  status: BidStatus;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'ProjectId',
  })
  project: Project;

  @ForeignKey(() => ProjectTender)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectTenderId: string;

  @BelongsTo(() => ProjectTender, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'ProjectTenderId',
  })
  projectTender: ProjectTender;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  ownerId: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'ownerId',
    onDelete: 'CASCADE',
  })
  Owner?: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById', onDelete: 'SET NULL' })
  UpdatedBy: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy: User | null;

  @Column
  migratedAt: Date | null;
}

import { DataTypes } from 'sequelize';
import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  BeforeDestroy,
  DeletedAt,
  HasOne,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Contract } from 'src/modules/contract/models';
import { BaseModel } from 'src/modules/database/base.model';
import { ProjectMedia } from 'src/modules/project-media/models/project-media.model';
import { ProjectFundManager } from 'src/modules/project-fundManager/model/projectFundManager.model';
import { ProjectWallet } from 'src/modules/project-wallet/models/project-wallet.model';
import { RfqRequest, RfqRequestMaterial } from 'src/modules/rfq/models';
import { UserProject } from 'src/modules/fund-manager/models/shared-project.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { User } from 'src/modules/user/models/user.model';
import { ProjectTender } from '../../fund-manager/models/project-tender.model';
import { ProjectShares } from './project-shared.model';
import { MaterialSchedule } from 'src/modules/material-schedule-upload/models/material-schedule.model';
import { ProjectGroup } from './project-group';
import { GroupName } from './group-name.model';
import { TenderBid } from './project-tender-bids.model';
import { Documents } from 'src/modules/documents/models/documents.model';

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVE = 'ARCHIVE',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  PAUSED = 'PAUSED',
  DISPUTE = 'DISPUTE',
  APPROVED = 'APPROVED',
}

export enum ProjectType {
  REQUEST = 'REQUEST',
  INVITE = 'INVITE',
  COMPANY = 'COMPANY',
}

@Table({
  paranoid: true,
})
export class Project extends BaseModel<Project> {
  @Column({
    type: DataType.ENUM(...Object.values(ProjectType)),
    defaultValue: ProjectType.COMPANY,
    allowNull: false,
  })
  ProjectType?: ProjectType;

  @Column({ type: DataTypes.DECIMAL(10, 8), allowNull: true })
  longitude?: number | null;

  @Column({ type: DataTypes.DECIMAL(10, 8), allowNull: true })
  latitude?: number | null;

  @Column
  location?: string | null;

  @Column
  image?: string | null;

  @Column
  fileName?: string | null;

  @Column({
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'Please  provide description here ',
  })
  description?: string | null;

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

  @ForeignKey(() => ProjectWallet)
  @Column({ type: DataType.UUID, allowNull: true })
  walletId?: string | null;

  @BelongsTo(() => ProjectWallet, {
    foreignKey: 'walletId',
    onDelete: 'SET NULL',
  })
  ProjectWallet?: ProjectWallet | null;

  @ForeignKey(() => TenderBid)
  @Column({ type: DataType.UUID, allowNull: true })
  awardedBidId?: string | null;

  @BelongsTo(() => TenderBid, {
    foreignKey: 'awardedBidId',
    onDelete: 'SET NULL',
  })
  awardedBid?: TenderBid | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById?: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById', onDelete: 'SET NULL' })
  UpdatedBy?: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById?: string | null;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy?: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  ownerId?: string | null;

  @BelongsTo(() => User, { foreignKey: 'ownerId', onDelete: 'SET NULL' })
  Owner?: User | null;

  @Column({ type: DataType.STRING })
  title?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatus)),
    defaultValue: ProjectStatus.ACTIVE,
    allowNull: false,
  })
  status?: ProjectStatus;

  @Column({ type: DataType.FLOAT, allowNull: true, defaultValue: 0 })
  budgetAmount?: number | null;

  @Column({ type: DataType.FLOAT, allowNull: true, defaultValue: 0 })
  amountSpent?: number | null;

  @Column({ type: DataType.FLOAT, allowNull: true, defaultValue: 0 })
  amountLeft?: number | null;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  isFunded?: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: new Date().toISOString(),
  })
  fundedAt?: Date | null;

  @BelongsToMany(() => FundManager, () => ProjectShares)
  fundManagers?: FundManager[];

  @BelongsToMany(() => Builder, () => ProjectShares)
  developers?: Builder[];

  // Means that the fund manager created this project
  @HasOne(() => ProjectFundManager)
  projectFundManager: ProjectFundManager;

  @HasMany(() => ProjectShares)
  projectShares: ProjectShares[];

  @HasMany(() => RfqRequest)
  Rfqs?: RfqRequest[];

  @HasMany(() => ProjectMedia)
  Medias?: ProjectMedia[];

  @HasMany(() => Documents)
  documents?: Documents[];

  @BelongsToMany(() => GroupName, () => ProjectGroup)
  Groups?: GroupName[];

  @HasMany(() => ProjectTender)
  Tenders?: ProjectTender[];

  @HasMany(() => TenderBid)
  bids?: TenderBid[];

  @HasMany(() => MaterialSchedule)
  materialSchedules?: MaterialSchedule[];

  @BeforeDestroy
  static async beforeDestroyHook(instance: Project) {
    // Before destroying a Project instance, delete associated Contracts
    const contracts = await Contract.findAll({
      where: { ProjectId: instance.id },
    });

    await Promise.all(
      contracts.map(async (contract) => {
        await contract.destroy();
      }),
    );

    return Promise.resolve();
  }

  @Column
  migratedAt?: Date | null;
}

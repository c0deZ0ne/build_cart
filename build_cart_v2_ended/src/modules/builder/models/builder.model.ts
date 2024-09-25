import {
  BelongsToMany,
  Column,
  DataType,
  Table,
  HasMany,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { BuilderFundManager } from 'src/modules/project/models/builder-fundManager-project.model';
import { BuilderProject } from 'src/modules/builder-project/model/builderProject.model';
import { BaseModel } from 'src/modules/database/base.model';
import { Documents } from 'src/modules/documents/models/documents.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { MyVendor } from 'src/modules/my-vendor/models/myVendor.model';
import { ProjectShares } from 'src/modules/project/models/project-shared.model';
import { ProjectTender } from 'src/modules/fund-manager/models/project-tender.model';
import { Project } from 'src/modules/project/models/project.model';
import { RetailTransaction } from 'src/modules/retail/models/retail-transaction.model';
import { User } from 'src/modules/user/models/user.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { Bank } from 'src/modules/bank/models/bank.model';
import { RateReview } from 'src/modules/rate-review/model/rateReview.model';

export enum CreditStatus {
  DISABLED = 'DISABLED',
  APPROVED = 'APPROVED',
}

export enum BuilderTier {
  one = 'one',
  two = 'two',
  three = 'three',
}
enum BusinessSize {
  MICRO = 'MICRO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

@Table({
  paranoid: true,
})
export class Builder extends BaseModel<Builder> {
  @Column({ unique: true })
  email: string;

  @Column
  businessName: string | null;

  @Column
  businessAddress: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(BusinessSize)),
    allowNull: true,
  })
  businessSize: BusinessSize | null;

  @Column
  certificateOfLocation: string | null;

  @Column
  certificateOfIncorporation: string | null;

  @Column
  BusinessContactId: string | null;

  @Column
  BusinessContactSignature: string | null;

  @Column
  BankStatement: string | null;

  @Column
  businessRegNo: string | null;

  @Column
  UtilityBill: string | null;

  @Column
  isIndividual: boolean | null;

  @Column({ type: DataType.BOOLEAN })
  isBusinessVerified: boolean | null;

  @Column({ type: DataType.STRING, allowNull: true })
  logo: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  other_docs: string | null;

  @Column
  about: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(CreditStatus)),
    defaultValue: CreditStatus.DISABLED,
    allowNull: false,
  })
  creditStatus: CreditStatus;

  @HasMany(() => RateReview)
  RateReviews?: RateReview[];

  @Column({
    type: DataType.ENUM(...Object.values(BuilderTier)),
    defaultValue: BuilderTier.one,
    allowNull: false,
  })
  tier: BuilderTier;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  })
  createdById: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  })
  updatedById: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  ownerId: string | null;
  @BelongsTo(() => User, {
    foreignKey: 'ownerId',
    onDelete: 'CASCADE',
  })
  owner: User;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  procurementManagerId: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'procurementManagerId',
    onDelete: 'CASCADE',
  })
  procurementManager: User;

  @BelongsToMany(() => Vendor, () => MyVendor)
  Vendors: Vendor[];

  @BelongsToMany(() => Project, () => BuilderProject)
  CompanyProjects: Project[];

  @BelongsToMany(() => Project, () => ProjectShares, 'BuilderId', 'ProjectId')
  ProjectInvites: Project[];

  @HasOne(() => Bank)
  bank?: Bank;

  @BelongsToMany(
    () => FundManager,
    () => BuilderFundManager,
    'FundManagerId',
    'BuilderId',
  )
  myFundManagers: FundManager[];

  @BelongsToMany(
    () => Project,
    () => BuilderFundManager,
    'ProjectId',
    'BuilderId',
  )
  mySponsoredProjects: Project[];

  @Column
  lastLogin: Date | null;

  @HasMany(() => Documents)
  documents: Documents[];

  @HasMany(() => RetailTransaction)
  transactions: RetailTransaction[];

  @Column
  migratedAt: Date | null;
}

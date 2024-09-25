import {
  Column,
  Table,
  BelongsTo,
  ForeignKey,
  BeforeSave,
  DataType,
  BelongsToMany,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import * as argon2 from 'argon2';
import { BaseModel } from 'src/modules/database/base.model';
import { Vendor } from '../../vendor/models/vendor.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { UserWallet } from '../../user-wallet/models/user-wallet.model';
import { Role } from 'src/modules/rbac/models/role.model';
import { UserRole } from 'src/modules/rbac/models/user-role.model';
import { DataTypes } from 'sequelize';
import { Documents } from 'src/modules/documents/models/documents.model';
import { Team } from 'src/modules/rbac/models/team.model';
import { TeamMember } from 'src/modules/rbac/models/user-teammembers.model';
import { Project } from 'src/modules/project/models/project.model';
import { UserProject } from 'src/modules/fund-manager/models/shared-project.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { ProjectShares } from 'src/modules/project/models/project-shared.model';
import { ProjectTender } from 'src/modules/fund-manager/models/project-tender.model';
import { UserLog } from 'src/modules/user-log/models/user-log.model';
import { Subscription } from 'src/modules/platfrom-subscription/model/subscription.model';

export enum UserType {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  BUILDER = 'BUILDER',
  SUPPLIER = 'SUPPLIER',
  FUND_MANAGER = 'FUND_MANAGER',
}

export enum UserLevel {
  ALPHA = 'ALPHA',
  BETA = 'BETA',
  OMEGA = 'OMEGA',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  DEACTIVATED = 'DEACTIVATED',
  PAUSED = 'PAUSED',
}

export enum IdVerificationStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
}

@Table({
  paranoid: true,
  timestamps: true,
})
export class User extends BaseModel<User> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  recovery_request_type: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  recovery_request: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @Column({ type: DataType.STRING, allowNull: true })
  location: string;

  @Column({ type: DataType.STRING, allowNull: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  businessName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phoneNumber: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  acceptTerms: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  twoFactorAuthEnabled: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  emailNotificationEnabled: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  smsNotificationEnabled: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  sso_user: boolean;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: [],
  })
  signatures: string[];

  @Column({
    type: DataType.ENUM(...Object.values(UserType)),
    allowNull: true,
  })
  userType: UserType;

  @Column({
    type: DataType.ENUM(...Object.values(IdVerificationStatus)),
    allowNull: true,
    defaultValue: IdVerificationStatus.PENDING,
  })
  IdVerificationStatus: IdVerificationStatus;

  @Column({
    type: DataType.ENUM(...Object.values(UserLevel)),
    defaultValue: UserLevel.ALPHA,
    allowNull: false,
  })
  level: UserLevel;

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    defaultValue: UserStatus.PENDING,
    allowNull: false,
  })
  status: UserStatus;

  @HasOne(() => UserWallet)
  wallet: UserWallet;

  @ForeignKey(() => UserWallet)
  @Column({ type: DataType.UUID, allowNull: true })
  walletId?: string | null;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: true })
  VendorId: string | null;

  @BelongsTo(() => Vendor, {
    foreignKey: 'VendorId',
    onDelete: 'CASCADE',
  })
  Vendor?: Vendor;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string | null;

  @BelongsTo(() => Builder, {
    foreignKey: 'BuilderId',
    onDelete: 'CASCADE',
  })
  Builder?: Builder;

   @ForeignKey(() => Subscription)
   @Column({ type: DataType.UUID, allowNull: true })
   subscriptionId: string | null;
  
  @HasOne(() => Subscription, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  })
  Subscription?: Subscription;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId?: string | null;

  @BelongsTo(() => FundManager, {
    foreignKey: 'FundManagerId',
    onDelete: 'CASCADE',
  })
  FundManager?: FundManager;

  @Column({ type: DataType.INTEGER, allowNull: true })
  emailOtp: number | null;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  emailOtpExpiry: Date | null;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  emailVerified: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  resetPasswordOtp: number | null;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  resetPasswordOtpExpiry: Date | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'CreatedById',
    as: 'CreatedBy',
    onDelete: 'SET NULL',
  })
  CreatedBy?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById', onDelete: 'SET NULL' })
  UpdatedBy?: User;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

  @BelongsToMany(() => Team, () => TeamMember)
  teams: Team[];

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  lastLogin: Date | null;

  @Column
  migratedAt: Date | null;

  @HasMany(() => Documents)
  documents: Documents[];

  @HasMany(() => ProjectTender)
  projectTenders: ProjectTender[];

  @HasMany(() => UserLog,{ foreignKey: 'teamMemberId', onDelete: 'SET NULL' })
  logs: UserLog[];

  @BeforeSave
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      const hashedPassword = await argon2.hash(user.password);
      user.password = hashedPassword;
    }
  }
}

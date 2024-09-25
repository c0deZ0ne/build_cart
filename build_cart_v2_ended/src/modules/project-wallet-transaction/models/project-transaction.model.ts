import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { ProjectWallet } from 'src/modules/project-wallet/models/project-wallet.model';
import { Project } from 'src/modules/project/models/project.model';
import { ProjectTransactionUser } from 'src/modules/shared-wallet-transaction/shared-transactions.model';
import { UserWallet } from 'src/modules/user-wallet/models/user-wallet.model';
import { User } from 'src/modules/user/models/user.model';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_USSD = 'BANK_USSD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CUTSTRUCT_PAY = 'CUTSTRUCT_PAY',
}

export enum ProjectPaymentPurpose {
  RFQ_REQUEST = 'RFQ_REQUEST',
  FUND_PROJECT_WALLET = 'FUND_PROJECT_WALLET',
  FUND_WALLET = 'FUND_WALLET',
  FUND_ORDER = 'FUND_ORDER',
}

export enum PaymentProvider {
  PAYSTACK = 'PAYSTACK',
  FLUTTERWAVE = 'FLUTTERWAVE',
  BANI = 'BANI',
  CUTSTRUCT = 'CUTSTRUCT',
  PAYPAL = 'PAYPAL',
}

@Table({
  paranoid: true,
})
export class ProjectTransaction extends BaseModel<ProjectTransaction> {
  @ForeignKey(() => UserWallet)
  @Column({ type: DataType.UUID })
  walletId: string | null;

  @BelongsTo(() => UserWallet)
  UserWallet: UserWallet;

  @ForeignKey(() => ProjectWallet)
  @Column({ type: DataType.UUID })
  ProjectWalletId: string;

  @BelongsTo(() => ProjectWallet)
  ProjectWallet: ProjectWallet;

  @Column({ type: DataType.DECIMAL(10, 2) })
  amount: number;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID })
  ProjectId: string | null;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.ENUM(...Object.values(TransactionType)) })
  userType: TransactionType;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
    defaultValue: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  fee: number | null;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    defaultValue: PaymentMethod.CUTSTRUCT_PAY,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentProvider)),
    defaultValue: PaymentProvider.CUTSTRUCT,
  })
  paymentProvider: PaymentProvider;

  @Column({
    type: DataType.ENUM(...Object.values(ProjectPaymentPurpose)),
    defaultValue: ProjectPaymentPurpose.FUND_PROJECT_WALLET,
  })
  paymentPurpose: ProjectPaymentPurpose;

  @Column({
    type: DataType.STRING,
    defaultValue: `cut${Math.random().toString(35).substring(2, 35)}`,
  })
  reference: string;
  @Column({
    type: DataType.DATE,
    defaultValue: new Date(),
  })
  timestamp: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById?: string | null;

  @BelongsToMany(() => User, () => ProjectTransactionUser)
  Users: User[];

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy?: User | null;
}

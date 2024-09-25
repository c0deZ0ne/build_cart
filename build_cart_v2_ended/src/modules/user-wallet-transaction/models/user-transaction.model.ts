import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserWallet } from '../../user-wallet/models/user-wallet.model';
import { User } from 'src/modules/user/models/user.model';
import { Project } from 'src/modules/project/models/project.model';
import { RfqRequest } from 'src/modules/rfq/models';
import { BaseModel } from 'src/modules/database/base.model';
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

export enum PaymentPurpose {
  RFQ_REQUEST = 'RFQ_REQUEST',
  PROJECT = 'PROJECT',
  WALLET = 'WALLET',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_USSD = 'BANK_USSD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CUTSTRUCT_PAY = 'CUTSTRUCT_PAY',
}

export enum PaymentProvider {
  PAYSTACK = 'PAYSTACK',
  FLUTTERWAVE = 'FLUTTERWAVE',
  BANI = 'BANI',
  CUTSTRUCT = 'CUTSTRUCT',
  PAYPAL = 'PAYPAL',
  REMITA = 'REMITA',
}
export enum ItemTypes {
  RFQ_REQUEST = 'RFQ_REQUEST',
  PROJECT = 'PROJECT',
  WALLET = 'WALLET',
}

@Table({
  paranoid: true,
})
export class UserTransaction extends BaseModel<UserTransaction> {
  @ForeignKey(() => UserWallet)
  @Column({ type: DataType.UUID })
  UserWalletId: string;

  @BelongsTo(() => UserWallet, {
    foreignKey: 'UserWalletId',
    onDelete: 'SET NULL',
  })
  UserWallet: UserWallet;

  @Column({ type: DataType.DECIMAL(10, 2) })
  amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentPurpose)),
    allowNull: false,
  })
  paymentPurpose: PaymentPurpose;

  
  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: false,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: DataType.ENUM(...Object.values(ItemTypes)),
    allowNull: true,
    defaultValue:ItemTypes.WALLET,
  })
  ItemTypes: ItemTypes;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentProvider)),
    defaultValue: PaymentProvider.CUTSTRUCT,
  })
  paymentProvider: PaymentProvider;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: true })
  ProjectId?: string | null;

  @BelongsTo(() => Project)
  Project?: Project | null;

  @ForeignKey(() => RfqRequest)
  @Column({ type: DataType.UUID, allowNull: true })
  RfqRequestId?: string | null;

  @BelongsTo(() => RfqRequest)
  RfqRequest?: RfqRequest | null;

  @Column({ type: DataType.STRING })
  itemName: string;

  @Column({ type: DataType.STRING })
  paymentType: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.DATE })
  timestamp: Date;

  @Column({ type: DataType.STRING })
  @Column({ type: DataType.ENUM(...Object.values(TransactionType)) })
  type: TransactionType;

  @Column({ type: DataType.ENUM(...Object.values(TransactionStatus)) })
  status: TransactionStatus;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
  })
  meta: object | Record<string, never>;

  @Column({
    type: DataType.STRING,
    defaultValue: `cut${Math.random().toString(35).substring(2, 35)}`,
  })
  reference: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById?: string | null;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy?: User | null;
}

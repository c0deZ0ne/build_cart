import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Contract } from 'src/modules/contract/models';
import { BaseModel } from 'src/modules/database/base.model';
import { Order } from 'src/modules/order/models';
import { User } from 'src/modules/user/models/user.model';
import { PaymentMethod, PaymentProvider, PaymentStatus, SystemPaymentPurpose } from '../types';
import { UserWallet } from 'src/modules/user-wallet/models/user-wallet.model';
import { ProjectWallet } from 'src/modules/project-wallet/models/project-wallet.model';
import { Project } from 'src/modules/project/models/project.model';

@Table({
  paranoid: true,
})
export class Payment extends BaseModel<Payment> {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById?: string | null;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy?: User | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById?: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById', onDelete: 'SET NULL' })
  UpdatedBy?: User | null;

  @ForeignKey(() => Contract)
  @Column({ type: DataType.UUID, allowNull: true })
  ContractId?: string | null;

  @BelongsTo(() => Contract, { foreignKey: 'ContractId', onDelete: 'SET NULL' })
  Contract?: Contract;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: true })
  OrderId?: string | null;

  @BelongsTo(() => Order, { foreignKey: 'OrderId', onDelete: 'SET NULL' })
  Order?: Order | null;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: true })
  ProjectId?: string | null;

  @BelongsTo(() => Project, { foreignKey: 'ProjectId', onDelete: 'SET NULL' })
  Project?: Project | null;


  @ForeignKey(() => UserWallet)
  @Column({ type: DataType.UUID, allowNull: true })
  walletId?: string | null;

  @BelongsTo(() => UserWallet, { foreignKey: 'walletId', onDelete: 'SET NULL' })
  UserWallet?: UserWallet | null;

  @ForeignKey(() => ProjectWallet)
  @Column({ type: DataType.UUID, allowNull: true })
  ProjectWalletId?: string | null;

  @BelongsTo(() => ProjectWallet, { foreignKey: 'ProjectWalletId', onDelete: 'SET NULL' })
  ProjectWallet?: ProjectWallet | null;

  @Column({ type: DataType.STRING })
  pay_ref?: string;

  @Column({ type: DataType.STRING })
  pay_ext_ref?: string;

  @Column({ type: DataType.STRING })
  description?: string;

  @Column({ type: DataType.JSON, allowNull: true })
  order_details?: object | null;

  @Column({ type: DataType.DECIMAL(15, 2) })
  pay_amount_collected?: number;

  @Column({ type: DataType.DECIMAL(15, 2) })
  pay_amount?: number;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: false,
  })
  pay_status?: PaymentStatus;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: true,
    defaultValue:PaymentMethod.BANK_TRANSFER
  })
  paymentMethod?: PaymentMethod;

  @Column({ type: DataType.DECIMAL(15, 2) })
  pay_amount_outstanding?: number;

  @Column({ type: DataType.DECIMAL(15, 2) })
  merch_amount?: number;

  
  @Column({ type: DataType.JSON, allowNull: true })
  custom_data?: any | null;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentProvider)),
    allowNull: false,
    defaultValue:PaymentProvider.CUTSTRUCT_PAY
  })
  paymentProvider?: PaymentProvider;

   @Column({
    type: DataType.ENUM(...Object.values(SystemPaymentPurpose)),
    defaultValue: SystemPaymentPurpose.FUND_PROJECT_WALLET,
  })
  paymentPurpose: SystemPaymentPurpose;

   @Column({
    type: DataType.DATE,
    defaultValue: new Date(),
  })
   createdAt: Date;
  
  @Column
  reciept_url?: string | null;
  @Column
  migratedAt?: Date | null;
}

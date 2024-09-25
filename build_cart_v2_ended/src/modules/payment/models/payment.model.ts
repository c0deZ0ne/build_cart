import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Contract } from 'src/modules/contract/models';
import { BaseModel } from 'src/modules/database/base.model';
import { Order } from 'src/modules/order/models';
import { Project } from 'src/modules/project/models/project.model';
import { RfqRequest, RfqRequestMaterial } from 'src/modules/rfq/models';
import { User } from 'src/modules/user/models/user.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}
export enum PaymentProvider {
  BANI = 'BANI',
  PAYSTACK = 'PAYSTACK',
  REMITTER = 'REMITTER',
  BANK = 'BANK_TRANSFER',
  CUTSTRUCT_PAY = 'CUTSTRUCT_PAY',
}

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

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId?: string;

  @BelongsTo(() => Builder)
  Builder?: Builder;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: true })
  VendorId?: string;

  @BelongsTo(() => Vendor)
  Vendor?: Vendor;

  @ForeignKey(() => Contract)
  @Column({ type: DataType.UUID, allowNull: true })
  ContractId?: string | null;

  @BelongsTo(() => Contract, { foreignKey: 'ContractId', onDelete: 'SET NULL' })
  Contract?: Contract;

  @ForeignKey(() => Contract)
  @Column({ type: DataType.UUID, allowNull: true })
  orderId?: string | null;

  @BelongsTo(() => Order, { foreignKey: 'OrderId', onDelete: 'SET NULL' })
  Order?: Order | null;

  @Column({ type: DataType.STRING })
  pay_ref?: string;

  @Column({ type: DataType.STRING })
  pay_ext_ref?: string;

  @Column({ type: DataType.STRING })
  title?: string;

  @Column({ type: DataType.STRING })
  vend_token?: string;

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

  @Column({ type: DataType.DECIMAL(15, 2) })
  pay_amount_outstanding?: number;

  @Column({ type: DataType.DECIMAL(15, 2) })
  match_amount?: number;

  @Column({ type: DataType.STRING })
  pub_date?: string;

  @Column({ type: DataType.STRING })
  modified_date?: string;

  @Column({ type: DataType.STRING })
  match_currency?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  RfqRequestId?: string | null;

  @BelongsTo(() => RfqRequest, {
    foreignKey: 'RfqRequestId',
    onDelete: 'SET NULL',
  })
  rfqRequest?: RfqRequest | null;

  @Column({ type: DataType.STRING, allowNull: true })
  RfqRequestMaterialId?: string | null;

  @BelongsTo(() => RfqRequestMaterial, {
    foreignKey: 'RfqRequestMaterialId',
    onDelete: 'SET NULL',
  })
  RfqRequestMaterial?: RfqRequestMaterial | null;

  @Column({ type: DataType.STRING, allowNull: true })
  ProjectId?: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'ProjectId',
    onDelete: 'SET NULL',
  })
  project?: Project | null;

  @Column({ type: DataType.JSON, allowNull: true })
  custom_data?: any | null;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentProvider)),
    allowNull: false,
  })
  paymentProvider?: PaymentProvider;

  @Column
  receipt_url?: string | null;
  @Column
  migratedAt?: Date | null;
}

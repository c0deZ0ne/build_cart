import {
  Table,
  Column,
  BelongsTo,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { RfqQuote, RfqRequestMaterial } from 'src/modules/rfq/models';
import { RfqRequest } from 'src/modules/rfq/models/rfqRequest.model';
import { Project } from 'src/modules/project/models/project.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { User } from 'src/modules/user/models/user.model';
import { Order } from './order.model';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING',
}

export enum RfqRequestPaymentTerm {
  ESCROW = 'ESCROW',
  CREDIT = 'CREDIT',
  BNPL = 'BNPL',
  PAY_ON_DELIVERY = 'PAY_ON_DELIVERY',
}
@Table({
  paranoid: true,
})
export class DeliverySchedule extends BaseModel<DeliverySchedule> {
  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.PENDING,
    allowNull: false,
  })
  status: OrderStatus;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  quantity: number;

  @Column({ type: DataType.DATE, allowNull: false })
  dueDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(RfqRequestPaymentTerm)),
    defaultValue: RfqRequestPaymentTerm.ESCROW,
    allowNull: true,
  })
  paymentTerm: RfqRequestPaymentTerm;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @ForeignKey(() => RfqRequestMaterial)
  @Column({ allowNull: false })
  rfqRequestMaterialId: string;

  @BelongsTo(() => RfqRequestMaterial, { onDelete: 'NO ACTION' })
  RfqRequestMaterial: RfqRequestMaterial;

  @ForeignKey(() => Order)
  @Column({ allowNull: false })
  orderId: string;

  @BelongsTo(() => Order, { onDelete: 'NO ACTION' })
  order: Order;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: false })
  VendorId: string;

  @BelongsTo(() => Vendor, { onDelete: 'SET NULL' })
  Vendor?: Vendor;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string;

  @BelongsTo(() => Builder)
  Builder?: Builder;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId: string;

  @BelongsTo(() => FundManager, { onDelete: 'SET NULL' })
  FundManager?: FundManager;

  @ForeignKey(() => RfqQuote)
  @Column({ type: DataType.UUID, allowNull: false, unique: false })
  RfqQuoteId: string;

  @BelongsTo(() => RfqQuote, { onDelete: 'CASCADE' })
  RfqQuote: RfqQuote;

  @ForeignKey(() => RfqRequest)
  @Column({ type: DataType.UUID, allowNull: false })
  RfqRequestId: string;

  @BelongsTo(() => RfqRequest, { onDelete: 'CASCADE' })
  RfqRequest: RfqRequest;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, { onDelete: 'CASCADE' })
  Project: Project;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById', onDelete: 'SET NULL' })
  UpdatedBy: User;

  @Column({ type: DataType.DATE, allowNull: true })
  paidAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  completed: Date;

  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  deletedAt: Date;

  @Column
  migratedAt: Date | null;
}

import {
  Table,
  Column,
  BelongsTo,
  DataType,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { RfqQuote } from 'src/modules/rfq/models';
import { RfqRequest } from 'src/modules/rfq/models/rfqRequest.model';
import { RateReview } from 'src/modules/rate-review/model/rateReview.model';
import { User } from 'src/modules/user/models/user.model';
import { Project } from 'src/modules/project/models/project.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { Order } from 'src/modules/order/models';

export enum ContractStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum AdminPaymentRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  DISABLED = 'DISABLED',
  BLOCKED = 'BLOCKED',
}

export enum ContractDeliveryStatus {
  PROCESSING = 'PROCESSING',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
  INREVIEW = 'INREVIEW',
}

export enum ContractPaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  CONFIRMED = 'CONFIRMED',
}

@Table({
  paranoid: true,
})
export class Contract extends BaseModel<Contract> {
  @Column({
    type: DataType.ENUM(...Object.values(ContractStatus)),
    defaultValue: ContractStatus.PENDING,
    allowNull: false,
  })
  status: ContractStatus;

  @Column({
    type: DataType.ENUM(...Object.values(ContractDeliveryStatus)),
    defaultValue: ContractDeliveryStatus.PROCESSING,
    allowNull: false,
  })
  deliveryStatus: ContractDeliveryStatus;

  @Column({
    type: DataType.ENUM(...Object.values(AdminPaymentRequestStatus)),
    defaultValue: AdminPaymentRequestStatus.DISABLED,
    allowNull: false,
  })
  adminPaymentRequestStatus: AdminPaymentRequestStatus;

  @Column({
    type: DataType.ENUM(...Object.values(ContractPaymentStatus)),
    defaultValue: ContractPaymentStatus.PENDING,
    allowNull: false,
  })
  paymentStatus: ContractPaymentStatus;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: false })
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor?: Vendor;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string;

  @BelongsTo(() => Builder)
  Builder?: Builder;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId: string;

  @BelongsTo(() => FundManager)
  FundManager?: FundManager;

  @ForeignKey(() => RfqQuote)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: false,
    onDelete: 'CASCADE',
  })
  RfqQuoteId: string;

  @BelongsTo(() => RfqQuote)
  RfqQuote?: RfqQuote;

  @ForeignKey(() => RfqRequest)
  @Column({ type: DataType.UUID, allowNull: false })
  RfqRequestId: string;

  @BelongsTo(() => RfqRequest)
  RfqRequest?: RfqRequest;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, { foreignKey: 'ProjectId', onDelete: 'CASCADE' })
  Project?: Project;

  @Column({ type: DataType.DATE, allowNull: true })
  dispatchedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  deliveredAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  paidAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  acceptedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  cancelledAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  completedAt: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isArchived: boolean;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  totalCost: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  fee: number;

  @HasOne(() => RateReview)
  RateReviewVendor: RateReview;

  @Column({ type: DataType.DATE, allowNull: true })
  disbursedAt: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isDisbursed: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  DisbursedById: string;

  @BelongsTo(() => User)
  DisbursedBy?: User;

  @HasOne(() => Order)
  order: Order;

  @Column
  migratedAt: Date | null;
  Buyer: any;

  get transformPaymentStatus(): string {
    if (
      this.paymentStatus === ContractPaymentStatus.PENDING ||
      this.paymentStatus === ContractPaymentStatus.PROCESSING
    ) {
      return 'AWAITING FUNDING';
    } else if (this.paymentStatus === ContractPaymentStatus.CONFIRMED) {
      return 'FUNDED';
    } else {
      return 'Unknown';
    }
  }

  get transformDeliveryStatus(): string {
    if (this.deliveryStatus === ContractDeliveryStatus.INREVIEW) {
      return 'IN-REVIEW';
    } else {
      return this.deliveryStatus;
    }
  }
}

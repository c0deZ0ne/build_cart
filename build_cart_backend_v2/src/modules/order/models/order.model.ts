import {
  Table,
  Column,
  BelongsTo,
  DataType,
  ForeignKey,
  BeforeDestroy,
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
import { Contract } from 'src/modules/contract/models';
import { Payment } from 'src/modules/payment/models/payment.model';
import { DeliverySchedule } from './order-schedule.model';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED',
  ONGOING = 'ONGOING',
  UPCOMING = 'UPCOMING',
}

@Table({
  paranoid: true,
  tableName: 'Orders',
  modelName: 'Order',
})
export class Order extends BaseModel<Order> {
  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.PENDING,
    allowNull: false,
  })
  status: OrderStatus;

  @ForeignKey(() => RfqRequestMaterial)
  @Column({ allowNull: false })
  rfqRequestMaterialId: string;

  @BelongsTo(() => RfqRequestMaterial)
  RfqRequestMaterial: RfqRequestMaterial;

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
  @Column({ type: DataType.UUID, allowNull: false, unique: false })
  RfqQuoteId: string;

  @BelongsTo(() => RfqQuote)
  RfqQuote: RfqQuote;

  @ForeignKey(() => RfqRequest)
  @Column({ type: DataType.UUID, allowNull: false })
  RfqRequestId: string;

  @BelongsTo(() => RfqRequest)
  RfqRequest: RfqRequest;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project)
  Project: Project;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById' })
  CreatedBy: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById' })
  UpdatedBy: User;

  @Column({ type: DataType.DATE, allowNull: true })
  paidAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  orderOtpExpiry: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  orderVerified: boolean;

  @Column({ type: DataType.NUMBER, allowNull: true })
  orderOtp: number;

  @Column({ type: DataType.DATE, allowNull: true })
  acceptedAt: Date;

  @ForeignKey(() => Contract)
  @Column({ type: DataType.UUID, allowNull: true })
  ContractId: string;

  @BelongsTo(() => Contract, { onDelete: 'SET NULL' })
  Contract: Contract;

  @ForeignKey(() => Payment)
  @Column({ type: DataType.UUID, allowNull: true })
  PaymentId: string | null;

  @BelongsTo(() => Payment, { onDelete: 'SET NULL' })
  Payment: Payment | null;
  @HasMany(() => DeliverySchedule)
  deliverySchedules: DeliverySchedule[];

  @BeforeDestroy
  static async deleteAssociatedContract(order: Order) {
    await Order.update(
      { ContractId: null },
      {
        where: {
          id: order.id,
        },
      },
    );
    const associatedContract = await Contract.findOne({
      where: { id: order.ContractId },
    });

    if (associatedContract) {
      await associatedContract.destroy();
    }
  }

  @Column
  migratedAt: Date | null;
}

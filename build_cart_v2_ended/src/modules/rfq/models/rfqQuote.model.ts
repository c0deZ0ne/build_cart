import {
  Column,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
  DataType,
  HasOne,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { RfqRequest } from './rfqRequest.model';
import { RfqBargain, RfqQuoteMaterial, RfqRequestMaterial } from '.';
import { Order } from 'src/modules/order/models';

export enum RfqQuoteStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  REOPENED = 'REOPENED',
}

export enum RfqQuoteBargainStatus {
  ACCEPTED = 'ACCEPTED',
  DISABLED = 'DISABLED',
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

@Table({
  paranoid: true,
})
export class RfqQuote extends BaseModel<RfqQuote> {
  @ForeignKey(() => RfqRequest)
  @Column({ allowNull: false })
  RfqRequestId: string;

  @BelongsTo(() => RfqRequest)
  RfqRequest?: RfqRequest;

  @ForeignKey(() => RfqRequestMaterial)
  @Column({ allowNull: false })
  rfqRequestMaterialId: string;

  @BelongsTo(() => RfqRequestMaterial)
  RfqRequestMaterial: RfqRequestMaterial;

  @ForeignKey(() => Vendor)
  @Column({ allowNull: false })
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor?: Vendor;

  @Column({ allowNull: false })
  deliveryDate: Date;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(RfqQuoteStatus)),
    defaultValue: RfqQuoteStatus.PENDING,
  })
  status: RfqQuoteStatus;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(RfqQuoteBargainStatus)),
    defaultValue: RfqQuoteBargainStatus.DISABLED,
  })
  rfqQuoteBargainStatus: RfqQuoteBargainStatus;

  @Column({ allowNull: false, defaultValue: 0 })
  tax: number;

  @Column({ allowNull: false, defaultValue: 0 })
  logisticCost: number;

  @Column(DataType.DECIMAL(10, 2))
  totalCost: number;

  @Column
  lpo: string;

  @Column({ allowNull: true })
  additionalNote: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById' })
  CreatedBy?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById' })
  UpdatedBy?: User;

  @HasMany(() => RfqQuoteMaterial)
  RfqQuoteMaterials?: RfqQuoteMaterial[];

  @HasMany(() => RfqBargain)
  RfqQuoteBargain?: RfqBargain[];

  @Column({ allowNull: false, defaultValue: false })
  isStarred: boolean;

  @Column({ allowNull: false, defaultValue: false })
  isArchived: boolean;

  @Column({ allowNull: false, defaultValue: false })
  isRead: boolean;

  @Column({ allowNull: false, defaultValue: true })
  canBargain: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  startDeliveryDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  endDeliveryDate: Date;

  @HasOne(() => Order)
  order: Order;
  @Column
  migratedAt: Date | null;
}

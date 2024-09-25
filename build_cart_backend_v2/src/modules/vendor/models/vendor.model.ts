import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { MyVendor } from 'src/modules/my-vendor/models/myVendor.model';
import { BaseModel } from 'src/modules/database/base.model';
import { RateReview } from 'src/modules/rate-review/model/rateReview.model';
import { Bank } from 'src/modules/bank/models/bank.model';
import { User } from 'src/modules/user/models/user.model';
import { RfqCategory, RfqRequest } from 'src/modules/rfq/models';
import { VendorRfqCategory } from './vendor-rfqCategory.model';
import { VendorRfqBlacklist } from './vendor-rfqBlacklist';
import { Product } from 'src/modules/product/models/product.model';
import { VendorProduct } from 'src/modules/vendor-product/models/vendor-product.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Order } from 'src/modules/order/models';

export enum BusinessSize {
  MICRO = 'MICRO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum VendorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export enum VendorType {
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
}

export enum VendorTier {
  one = 'one',
  two = 'two',
  three = 'three',
}

@Table({
  paranoid: true,
})
export class Vendor extends BaseModel<Vendor> {
  @Column({ unique: true })
  email: string;

  @Column
  businessName: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(BusinessSize)),
    defaultValue: null,
    allowNull: true,
  })
  businessSize: BusinessSize;

  @Column
  businessAddress: string | null;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  businessContactId: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  other: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  other_docs: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  BankStatement: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string | null;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  businessContactSignature: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  businessRegNo: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(VendorType)),
    allowNull: true,
  })
  VendorType: VendorType;

  @BelongsToMany(() => RfqCategory, () => VendorRfqCategory)
  RfqCategories?: RfqCategory[];

  @HasMany(() => Order)
  orders?: Order[];

  @Column
  market_vendor: boolean | null;

  @Column
  legalInfo: boolean | null;

  @Column({
    type: DataType.ENUM(...Object.values(VendorStatus)),
    defaultValue: VendorStatus.PENDING,
    allowNull: false,
  })
  status: VendorStatus;

  @Column({ type: DataType.STRING, allowNull: true })
  logo: string | null;

  @Column
  about: string | null;

  @Column
  store_number: string | null;

  @Column
  taxCompliance: boolean | null;

  @Column
  racialEquity: boolean | null;

  @Column
  termOfService: boolean | null;

  @HasMany(() => RateReview)
  RateReviews?: RateReview[];

  @BelongsToMany(() => Builder, () => MyVendor)
  Builders?: Builder[];

  @HasOne(() => Bank)
  Bank?: Bank;

  @Column
  lastLogin: Date | null;

  @Column({
    type: DataType.ENUM(...Object.values(VendorTier)),
    defaultValue: VendorTier.one,
    allowNull: true,
  })
  tier: VendorTier;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  certificateOfLocation: string | null;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  certificateOfIncorporation: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  UtilityBill: string | null;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  createdById: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'createdById',
    onDelete: 'SET NULL',
  })
  createdBy: User;

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
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  })
  updatedById: string | null;

  @BelongsTo(() => User, 'updatedById')
  updatedBy: User;

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

  @HasMany(() => VendorRfqBlacklist)
  RfqBlacklistRfqs?: VendorRfqBlacklist[];

  @Column
  migratedAt: Date | null;

  @BelongsToMany(() => Product, () => VendorProduct)
  Products?: Product[];
}

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { LabourHack } from 'src/modules/labour-hack/models/labour-hack.model';
import { ProductSpecificationProduct } from 'src/modules/product/models/productSpecification.model';
import { VendorProductSpecificationProduct } from 'src/modules/vendor-product/models/vendor-product-specification-product.model';
import { Builder } from 'src/modules/builder/models/builder.model';

export enum DURATION_UNIT {
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
}

export enum STATUS {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  FAILED = 'FAILED',
}
export enum TRANSACTION_TYPE {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
}

@Table({
  paranoid: true,
})
export class RetailTransaction extends BaseModel<RetailTransaction> {
  @Column
  item_description: string;

  @Column
  budget: number;

  @Column
  delivery_date: Date;

  @Column
  delivery_address: string;

  @Column
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration: number;

  @Column({
    type: DataType.ENUM(...Object.values(DURATION_UNIT)),
    allowNull: true,
  })
  duration_unit: DURATION_UNIT;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transaction_no: string;

  @Column({
    type: DataType.ENUM(...Object.values(STATUS)),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  status: STATUS;

  @Column({
    type: DataType.ENUM(...Object.values(TRANSACTION_TYPE)),
    allowNull: true,
  })
  transaction_type: TRANSACTION_TYPE;

  @ForeignKey(() => Builder)
  @Column
  builderID: string;

  @BelongsTo(() => Builder)
  builder: Builder;

  @ForeignKey(() => LabourHack)
  @Column
  labourHackID: string;

  @BelongsTo(() => LabourHack)
  labourHack: LabourHack;

  @ForeignKey(() => ProductSpecificationProduct)
  @Column
  productSpecificationProductID: string;

  @BelongsTo(() => ProductSpecificationProduct)
  productSpecificationProduct: ProductSpecificationProduct;

  @ForeignKey(() => VendorProductSpecificationProduct)
  @Column
  vendorProductSpecificationProductID: string;

  @BelongsTo(() => VendorProductSpecificationProduct)
  vendorProductSpecificationProduct: VendorProductSpecificationProduct;
}

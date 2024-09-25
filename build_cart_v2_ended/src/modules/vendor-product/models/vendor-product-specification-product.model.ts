import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { RetailTransaction } from 'src/modules/retail/models/retail-transaction.model';
import { VendorProductSpecification } from './vendor-product-specification.model';
import { VendorProduct } from './vendor-product.model';

@Table({
  paranoid: true,
})
export class VendorProductSpecificationProduct extends BaseModel<VendorProductSpecificationProduct> {
  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  price: number;

  @ForeignKey(() => VendorProduct)
  @Column(DataType.UUID)
  vendorProductId: string;

  @ForeignKey(() => VendorProductSpecification)
  @Column(DataType.UUID)
  vendorProductSpecificationId: string;

  @BelongsTo(() => VendorProduct)
  product: VendorProduct;

  @BelongsTo(() => VendorProductSpecification)
  specification: VendorProductSpecification;

  @HasMany(() => RetailTransaction)
  transactions: RetailTransaction[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  product_spec: string;
}

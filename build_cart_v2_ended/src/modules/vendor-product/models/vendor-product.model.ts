import {
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Product } from 'src/modules/product/models/product.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { VendorProductSpecificationProduct } from './vendor-product-specification-product.model';
import { VendorProductSpecification } from './vendor-product-specification.model';

@Table({
  paranoid: true,
})
export class VendorProduct extends BaseModel<VendorProduct> {
  @Column({
    allowNull: false,
    defaultValue: true,
  })
  product_visibility: boolean;

  @ForeignKey(() => Vendor)
  @Column
  vendorId: string;

  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @ForeignKey(() => Product)
  @Column
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsToMany(
    () => VendorProductSpecification,
    () => VendorProductSpecificationProduct,
    'vendorProductId',
    'vendorProductSpecificationId',
  )
  specifications: VendorProductSpecification[];
}

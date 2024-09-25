import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { VendorProduct } from 'src/modules/vendor-product/models/vendor-product.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { ProductCategory } from './category.model';
import { ProductMetric } from './metric.model';
import { ProductSpecificationProduct } from './productSpecification.model';
import { ProductSpecification } from './specification.model';

@Scopes(() => ({
  withSpecifications: {
    include: [
      {
        model: ProductSpecification,
        through: { attributes: [] }, // Exclude the join table attributes
      },
    ],
  },
}))
@Table({
  paranoid: true,
})
export class Product extends BaseModel<Product> {
  @Column
  name: string;

  @Column
  show_on_retail: boolean;

  @Column
  feature_product: boolean;

  @Column
  show_on_tracker: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  is_todays_pick: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  top_selling_item: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  price_range: string;

  @ForeignKey(() => ProductCategory)
  @Column
  categoryID: string;

  @BelongsTo(() => ProductCategory)
  category: ProductCategory;

  @ForeignKey(() => ProductMetric)
  @Column
  metricID: string;

  @Column({
    allowNull: false,
    defaultValue: true,
  })
  product_visibility: boolean;

  @BelongsTo(() => ProductMetric)
  metric: ProductMetric;

  @BelongsToMany(
    () => ProductSpecification,
    () => ProductSpecificationProduct,
    'productId',
    'productSpecificationId',
  )
  specifications: ProductSpecification[];

  @BelongsToMany(
    () => Vendor,
    () => VendorProduct,
    //  'productId', 'vendorId'
  )
  Vendors?: Vendor[];
}

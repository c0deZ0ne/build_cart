import { BelongsToMany, Column, Scopes, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { VendorProductSpecificationProduct } from './vendor-product-specification-product.model';
import { VendorProduct } from './vendor-product.model';

@Scopes(() => ({
  withProducts: {
    include: [
      {
        model: VendorProduct,
        through: { attributes: [] }, // Exclude the join table attributes
      },
    ],
  },
}))
@Table({
  paranoid: true,
})
export class VendorProductSpecification extends BaseModel<VendorProductSpecification> {
  @Column
  value: string;

  @BelongsToMany(
    () => VendorProduct,
    () => VendorProductSpecificationProduct,
    'vendorProductId',
    'vendorProductSpecificationId',
  )
  vendorProducts: VendorProduct[];
}

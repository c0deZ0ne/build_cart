import { BelongsToMany, Column, Scopes, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Product } from './product.model';
import { ProductSpecificationProduct } from './productSpecification.model';

@Scopes(() => ({
  withProducts: {
    include: [
      {
        model: Product,
        through: { attributes: [] },
      },
    ],
  },
}))
@Table({
  paranoid: true,
})
export class ProductSpecification extends BaseModel<ProductSpecification> {
  @Column
  value: string;

  @BelongsToMany(
    () => Product,
    () => ProductSpecificationProduct,
    'productId',
    'productSpecificationId',
  )
  products: Product[];
}

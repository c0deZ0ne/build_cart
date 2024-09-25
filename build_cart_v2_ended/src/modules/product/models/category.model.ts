import { Column, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Product } from './product.model';

@Table({
  paranoid: true,
})
export class ProductCategory extends BaseModel<ProductCategory> {
  @Column
  name: string;

  @Column
  image_url: string;

  @Column({
    allowNull: false,
    defaultValue: true,
  })
  product_visibility: boolean;

  @HasMany(() => Product)
  products: Product[];
}

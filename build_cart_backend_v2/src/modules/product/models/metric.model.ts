import { Column, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Product } from './product.model';

@Table({
  paranoid: true,
})
export class ProductMetric extends BaseModel<ProductMetric> {
  @Column
  name: string;

  @HasMany(() => Product)
  transactions: Product[];
}

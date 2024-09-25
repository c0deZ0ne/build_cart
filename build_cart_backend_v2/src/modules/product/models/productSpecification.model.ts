import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
  AfterCreate,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Product } from './product.model';
import { ProductSpecification } from './specification.model';
import { RetailTransaction } from 'src/modules/retail/models/retail-transaction.model';

@Table({
  paranoid: true,
})
export class ProductSpecificationProduct extends BaseModel<ProductSpecificationProduct> {
  @Column
  price: number;

  @ForeignKey(() => Product)
  @Column(DataType.UUID)
  productId: string;

  @ForeignKey(() => ProductSpecification)
  @Column(DataType.UUID)
  productSpecificationId: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => ProductSpecification)
  specification: ProductSpecification;

  @HasMany(() => RetailTransaction)
  transactions: RetailTransaction[];

  @Column
  product_spec: string;

  @AfterCreate
  static async updateProductSpec(instance: ProductSpecificationProduct) {
    const product = await Product.findByPk(instance.productId);
    const productSpecification = await ProductSpecification.findByPk(
      instance.productSpecificationId,
    );

    instance.product_spec = `${product.name} ${productSpecification.value}`;
    await instance.save();
  }
}

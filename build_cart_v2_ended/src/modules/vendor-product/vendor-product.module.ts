import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '../product/models/product.model';
import { Vendor } from '../vendor/models/vendor.model';
import { VendorAndProductController } from './controllers/vendor-product.controller';
import { VendorProductSpecificationProduct } from './models/vendor-product-specification-product.model';
import { VendorProductSpecification } from './models/vendor-product-specification.model';
import { VendorProduct } from './models/vendor-product.model';
import { VendorProductService } from './services/vendor-product.service';
import { VendorStoreController } from './controllers/vendor-store.controller';
import { ProductModule } from '../product/product.module';
import { VendorRfqCategory } from '../vendor/models/vendor-rfqCategory.model';
import { RfqCategory } from '../rfq/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      VendorProduct,
      Vendor,
      Product,
      VendorProductSpecification,
      VendorProductSpecificationProduct,
      VendorRfqCategory,
    ]),
    ProductModule,
  ],
  controllers: [VendorAndProductController, VendorStoreController],
  providers: [VendorProductService],
  exports: [VendorProductService],
})
export class VendorProductModule {}

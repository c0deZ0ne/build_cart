import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailModule } from '../email/email.module';
import { ProductCategory } from './models/category.model';
import { ProductMetric } from './models/metric.model';
import { ProductSpecification } from './models/specification.model';
import { ProductSpecificationProduct } from './models/productSpecification.model';
import { Product } from './models/product.model';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { CategoryController } from './controllers/category.controller';
import { MetricController } from './controllers/metric.controller';
import { SpecificationController } from './controllers/specification.controller';
import { ProductCategoryService } from './services/category.service';
import { ProductMetricService } from './services/metric.service';
import { ProductSpecificationService } from './services/specification.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Product,
      ProductCategory,
      ProductMetric,
      ProductSpecification,
      ProductSpecificationProduct,
    ]),
    EmailModule,
  ],
  controllers: [
    ProductController,
    CategoryController,
    MetricController,
    SpecificationController,
  ],
  providers: [
    ProductService,
    ProductCategoryService,
    ProductMetricService,
    ProductSpecificationService,
  ],
  exports: [ProductService],
})
export class ProductModule {}

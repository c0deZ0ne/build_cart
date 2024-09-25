import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './models/category.model';
import { RfqCategory } from '../rfq/models';

@Module({
  imports: [SequelizeModule.forFeature([Category, RfqCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}

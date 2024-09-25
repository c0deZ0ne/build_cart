import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { RfqCategory } from '../rfq/models';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
    @InjectModel(RfqCategory)
    private readonly rfwCategoryModel: typeof RfqCategory,
  ) {}

  async retrieveCategories() {
    return await this.rfwCategoryModel.findAll({
      order: [['title', 'ASC']],
    });
  }
}

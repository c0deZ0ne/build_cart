import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from '../dto/createCategoriesDto';
import { ProductCategory } from '../models/category.model';
import { UpdateCategoryDto } from '../dto/updateCategoryDto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectModel(ProductCategory)
    private readonly productCategoryModel: typeof ProductCategory,
  ) {}

  async createCategory(data: CreateCategoryDto) {
    const checkIfCategoryExists = await this.getCategoryByName(data.name);

    if (checkIfCategoryExists) {
      throw new ConflictException('This category already exists');
    }

    return await this.productCategoryModel.create(data);
  }

  async getAllCategory() {
    return await this.productCategoryModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async getCategoryById(id: string) {
    const category = await this.productCategoryModel.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async getCategoryByName(name: string) {
    const category = await this.productCategoryModel.findOne({
      where: { name },
    });
    if (!category) {
      return null;
    }
    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const category = await this.productCategoryModel.update(data, {
      where: { id },
      returning: true,
    });
    return category[1];
  }

  async deleteCategoryById(id: string) {
    const category = await this.productCategoryModel.destroy({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
}

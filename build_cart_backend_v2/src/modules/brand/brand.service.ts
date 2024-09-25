import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand, BrandPackage } from './models/brand.model';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand)
    private readonly brandModel: typeof Brand,
  ) {}

  async findAll() {
    return this.brandModel.findAndCountAll();
  }

  async findPremium() {
    return this.brandModel.findAndCountAll({
      where: { package: BrandPackage.BASIC },
    });
  }

  async getDetails(id: string): Promise<Brand> {
    const brand = await this.brandModel.findByPk(id);
    if (!brand) {
      throw new NotFoundException(`Brand not found`);
    }
    return brand;
  }
}

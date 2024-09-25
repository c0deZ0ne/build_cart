import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateSpecificationDto } from '../dto/updateSpecificationDto';
import { ProductSpecification } from '../models/specification.model';
import { CreateSpecificationDto } from '../dto/createSpecificationDto';

@Injectable()
export class ProductSpecificationService {
  constructor(
    @InjectModel(ProductSpecification)
    private readonly productSpecificationModel: typeof ProductSpecification,
  ) {}

  async createSpecification(data: CreateSpecificationDto) {
    const checkIfSpecificationExists = await this.getSpecificationByName(
      data.value,
    );

    if (checkIfSpecificationExists) {
      throw new ConflictException('This specification already exists');
    }

    return await this.productSpecificationModel.create(data);
  }

  async getAllSpecifications() {
    return await this.productSpecificationModel.findAll();
  }

  async getMetricById(id: string) {
    const specification = await this.productSpecificationModel.findOne({
      where: { id },
    });
    if (!specification) {
      throw new NotFoundException(`Specification with ID ${id} not found`);
    }
    return specification;
  }

  async getSpecificationByName(value: string) {
    const specification = await this.productSpecificationModel.findOne({
      where: { value },
    });
    if (!specification) {
      return null;
    }
    return specification;
  }

  async updateSpecification(id: string, data: UpdateSpecificationDto) {
    const specification = await this.productSpecificationModel.update(data, {
      where: { id },
      returning: true,
    });
    return specification[1];
  }

  async deleteSpecificationById(id: string) {
    const specification = await this.productSpecificationModel.destroy({
      where: { id },
    });

    if (!specification) {
      throw new NotFoundException(`Specification with ID ${id} not found`);
    }
    return specification;
  }
}

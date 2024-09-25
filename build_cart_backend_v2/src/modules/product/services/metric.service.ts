import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateMetricDto } from '../dto/createMetricDto';
import { UpdateMetricDto } from '../dto/updateMetricDto';
import { ProductMetric } from '../models/metric.model';

@Injectable()
export class ProductMetricService {
  constructor(
    @InjectModel(ProductMetric)
    private readonly productMetricModel: typeof ProductMetric,
  ) {}

  async createMetric(data: CreateMetricDto) {
    const checkIfMetricExists = await this.getMetricByName(data.name);

    if (checkIfMetricExists) {
      throw new ConflictException('This metric already exists');
    }

    return await this.productMetricModel.create(data);
  }

  async getAllMetic() {
    return await this.productMetricModel.findAll();
  }

  async getMetricById(id: string) {
    const metric = await this.productMetricModel.findOne({ where: { id } });
    if (!metric) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }
    return metric;
  }

  async getMetricByName(name: string) {
    const metric = await this.productMetricModel.findOne({ where: { name } });
    if (!metric) {
      return null;
    }
    return metric;
  }

  async updateMetric(id: string, data: UpdateMetricDto) {
    const metric = await this.productMetricModel.update(data, {
      where: { id },
      returning: true,
    });
    return metric[1];
  }

  async deleteMetricById(id: string) {
    const metric = await this.productMetricModel.destroy({ where: { id } });

    if (!metric) {
      throw new NotFoundException(`Metric with ID ${id} not found`);
    }
    return metric;
  }
}

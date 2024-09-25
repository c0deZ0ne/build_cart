import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LabourHack } from './models/labour-hack.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLabourHackDto } from './dto/createLabourHackDto';
import { UpdateLabourHackDto } from './dto/updateLabourHackDto';

@Injectable()
export class LabourHackService {
  constructor(
    @InjectModel(LabourHack)
    private readonly labourHackModel: typeof LabourHack,
  ) {}

  async createLabourHack(data: CreateLabourHackDto) {
    const checkIfLabourHackExists = await this.getLabourHackByName(data.name);

    if (checkIfLabourHackExists) {
      throw new ConflictException('This labourHack already exists');
    }

    return await this.labourHackModel.create(data);
  }

  async getAllLabourHack() {
    return await this.labourHackModel.findAll();
  }

  async getLabourHackById(id: string) {
    const labourHack = await this.labourHackModel.findOne({ where: { id } });
    if (!labourHack) {
      throw new NotFoundException(`LabourHack with ID ${id} not found`);
    }
    return labourHack;
  }

  async getLabourHackByName(name: string) {
    const labourHack = await this.labourHackModel.findOne({ where: { name } });
    if (!labourHack) {
      return null;
    }
    return labourHack;
  }

  async getLabourHackTransactions(id: string) {
    const labourHack = await this.labourHackModel.findOne({
      where: { id },
      include: [{ all: true }],
    });
    if (!labourHack) {
      throw new NotFoundException(`LabourHack with ID ${id} not found`);
    }
    return labourHack.transactions;
  }

  async updateLabourHack(id: string, data: UpdateLabourHackDto) {
    const labourHack = await this.labourHackModel.update(data, {
      where: { id },
      returning: true,
    });
    return labourHack[1];
  }

  async deleteLabourHackById(id: string) {
    const labourHack = await this.labourHackModel.destroy({ where: { id } });

    if (!labourHack) {
      throw new NotFoundException(`LabourHack with ID ${id} not found`);
    }
    return labourHack;
  }
}

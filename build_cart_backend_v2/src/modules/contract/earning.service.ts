import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as moment from 'moment';
import { Op, WhereOptions } from 'sequelize';
import {
  Contract,
  ContractDeliveryStatus,
  ContractPaymentStatus,
} from './models';
import { User } from 'src/modules/user/models/user.model';
import { Builder } from 'src/modules/builder/models/builder.model';

@Injectable()
export class EarningService {
  constructor(
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
  ) {}

  async getVendorEarnings(user: User, startDate?: Date, endDate?: Date) {
    const whereQuery: WhereOptions<Contract> = {
      VendorId: user.VendorId,
      paymentStatus: ContractPaymentStatus.CONFIRMED,
      deliveryStatus: ContractDeliveryStatus.DELIVERED,
    };
    if (startDate && endDate) {
      whereQuery.completedAt = {
        [Op.gte]: moment(startDate).startOf('d'),
        [Op.lte]: moment(endDate).startOf('d'),
      };
    }
    const earnings = await this.contractModel.findAndCountAll({
      attributes: ['id', 'disbursedAt', 'totalCost', 'fee', 'completedAt'],
      where: whereQuery,
      include: [
        {
          model: Builder,
        },
      ],
    });

    earnings.rows = earnings.rows.map((earning) => {
      const amountEarned = earning.totalCost - earning.fee;
      return {
        id: earning.id,
        date: earning.completedAt,
        client: earning.Builder,
        amount: earning.totalCost,
        earning: amountEarned,
      };
    }) as any;
    return earnings;
  }
}

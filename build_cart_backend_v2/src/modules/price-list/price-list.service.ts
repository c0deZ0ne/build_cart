import { Injectable } from '@nestjs/common';
import { PriceList } from './models/priceList.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { UpdatePriceListDto } from './dto/update-price-list.dto';

@Injectable()
export class PriceListService {
  constructor(
    @InjectModel(PriceList)
    private readonly pricelistModel: typeof PriceList,
  ) {}

  async retrievePriceList() {
    return await this.pricelistModel.findAll();
  }

  async bulkUpdatePriceList(
    updatePriceListDto: UpdatePriceListDto[],
    user: User,
  ) {
    await Promise.all(
      updatePriceListDto.map(async ({ id, price, label, metric }) => {
        await this.pricelistModel.upsert({
          id: id,
          label: label,
          price: price,
          metric: metric,
          UpdatedById: user.id,
        });
      }),
    );
  }
}

import { Module } from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { PriceList } from './models/priceList.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([PriceList])],
  controllers: [],
  providers: [PriceListService],
  exports: [PriceListService],
})
export class PriceListModule {}

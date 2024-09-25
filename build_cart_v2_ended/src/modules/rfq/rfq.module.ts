import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RfqService } from './rfq.service';
import { RfqController } from './rfq.controller';
import {
  RfqCategory,
  RfqItem,
  RfqRequestMaterial,
  RfqRequest,
  RfqRequestInvitation,
  RfqQuote,
  RfqQuoteMaterial,
  VendorRfqRequest,
  RfqBargain,
} from './models';
import { ProjectModule } from 'src/modules/project/project.module';
import { RfqQuoteService } from './rfq-quote.service';
import { MyVendorModule } from 'src/modules/my-vendor/my-vendor.module';
import { ContractModule } from 'src/modules/contract/contract.module';
import { Vendor } from '../vendor/models/vendor.model';
import { OrderModule } from '../order/order.module';
import { Order } from '../order/models';
import { User } from '../user/models/user.model';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import { MaterialScheduleModule } from '../material-schedule-upload/material-schedule.module';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { Contract } from '../contract/models';
import { Project } from '../project/models/project.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Vendor,
      UserUploadMaterial,
      DeliverySchedule,
      VendorRfqBlacklist,
      User,
      Order,
      RfqCategory,
      RfqItem,
      RfqRequestMaterial,
      RfqRequest,
      RfqRequestInvitation,
      RfqQuote,
      RfqQuoteMaterial,
      VendorRfqRequest,
      RfqBargain,
      RateReview,
      Contract,
      Project,
    ]),
    MaterialScheduleModule,
    OrderModule,
    ProjectModule,
    MyVendorModule,
    ContractModule,
  ],
  controllers: [RfqController],
  providers: [RfqService, RfqQuoteService],
  exports: [RfqService, RfqQuoteService],
})
export class RfqModule {}

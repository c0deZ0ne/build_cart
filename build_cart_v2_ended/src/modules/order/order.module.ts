import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RfqModule } from 'src/modules/rfq/rfq.module';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { Payment } from '../payment/models/payment.model';
import { RfqService } from '../rfq/rfq.service';
import {
  RfqBargain,
  RfqCategory,
  RfqItem,
  RfqQuote,
  RfqRequest,
  RfqRequestInvitation,
  RfqRequestMaterial,
  VendorRfqRequest,
} from '../rfq/models';
import { ProjectModule } from '../project/project.module';
import { MyVendorService } from '../my-vendor/my-vendor.service';
import { MyVendor } from '../my-vendor/models/myVendor.model';
import { Vendor } from '../vendor/models/vendor.model';
import { Contract } from '../contract/models';
import { ContractService } from '../contract/contract.service';
import { OrderService } from './order.services';
import { Order } from './models';
import { User } from '../user/models/user.model';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import { MaterialScheduleModule } from '../material-schedule-upload/material-schedule.module';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { DeliverySchedule } from './models/order-schedule.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { Project } from '../project/models/project.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Order,
      UserUploadMaterial,
      VendorRfqBlacklist,
      User,
      RfqQuote,
      Contract,
      Vendor,
      Payment,
      VendorRfqRequest,
      RfqItem,
      RfqCategory,
      RfqRequest,
      RfqRequestMaterial,
      RfqRequestInvitation,
      MyVendor,
      RfqBargain,
      DeliverySchedule,
      RateReview,
      Project,
    ]),
    forwardRef(() => RfqModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => EmailModule),
  ],
  providers: [
    OrderService,
    ContractService,
    RfqService,
    EmailService,
    MyVendorService,
  ],
  exports: [
    OrderService,
    ContractService,
    RfqService,
    RfqService,
    EmailService,
    MyVendorService,
  ],
})
export class OrderModule {}

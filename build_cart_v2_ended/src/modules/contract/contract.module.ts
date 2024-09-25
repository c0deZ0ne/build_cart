import { Module, forwardRef } from '@nestjs/common';
import { ContractService } from './contract.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contract } from './models';
import { RfqModule } from 'src/modules/rfq/rfq.module';
import { EarningService } from './earning.service';
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
import { OrderModule } from '../order/order.module';
import { Order } from '../order/models';
import { User } from '../user/models/user.model';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { Project } from '../project/models/project.model';
@Module({
  imports: [
    SequelizeModule.forFeature([
      RfqQuote,
      UserUploadMaterial,
      VendorRfqBlacklist,
      User,
      Order,
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
    forwardRef(() => ProjectModule),
    forwardRef(() => RfqModule),
    forwardRef(() => EmailModule),
    OrderModule,
  ],
  providers: [
    ContractService,
    RfqService,
    EarningService,
    EmailService,
    MyVendorService,
  ],
  exports: [
    ContractService,
    RfqService,
    EarningService,
    RfqService,
    EmailService,
    MyVendorService,
  ],
})
export class ContractModule {}

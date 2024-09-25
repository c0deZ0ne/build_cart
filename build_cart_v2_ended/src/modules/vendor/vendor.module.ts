import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { Vendor } from './models/vendor.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from 'src/modules/user/user.module';
import { BankModule } from 'src/modules/bank/bank.module';
import { DocumentsModule } from 'src/modules/documents/documents.module';
import { AccountController } from './account.controller';
import { RfqController } from './rfq.controller';
import { RfqModule } from 'src/modules/rfq/rfq.module';
import { ContractController } from './contract.controller';
import { ContractModule } from 'src/modules/contract/contract.module';
import { EarningController } from './earning.controller';
import { TwilioModule } from '../twilio/twilio.module';
import { KycConfirmationsController } from './documents.controller';
import { User } from '../user/models/user.model';
import { VendorRfqCategory } from './models/vendor-rfqCategory.model';
import { UserService } from '../user/user.service';
import { VendorRfqBlacklist } from './models/vendor-rfqBlacklist';
import { VendorRfqService } from './vendor-rfq.service';
import { RfqQuote, RfqRequestMaterial } from '../rfq/models';
import { VendorOrderService } from './vendor-order.services';
import { VendorOrderController } from './vendor-order.controller';
import { Order } from '../order/models';
import { Contract } from '../contract/models';
import { Payment } from '../payment/models/payment.model';
import { TemporaryVendorModule } from '../temporary-vendor/temporary-vendor.module';
import { ProductModule } from '../product/product.module';
import { VendorTransactionController } from './vendor-transaction.controller';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { Invitation } from '../invitation/models/invitation.model';
import { MyVendor } from '../my-vendor/models/myVendor.model';
import { InvitationModule } from '../invitation/invitation.module';
import { MyVendorModule } from '../my-vendor/my-vendor.module';
import { InvitationService } from '../invitation/invitation.service';
import { MyVendorService } from '../my-vendor/my-vendor.service';
import { Dispute } from '../dispute/models/dispute.model';
import { DisputeModule } from '../dispute/dispute.module';
import { DisputeService } from '../dispute/dispute.service';
import { RateReview } from '../rate-review/model/rateReview.model';
import { RateReviewModule } from '../rate-review/rate-review.module';
import { RateReviewService } from '../rate-review/rate-review.service';
import { DashboardController } from './dashboard.controller';
import { ProjectGroup } from '../project/models/project-group';
import { GroupName } from '../project/models/group-name.model';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      RfqRequestMaterial,
      UserTransaction,
      UserWallet,
      GroupName,
      RfqQuote,
      ProjectGroup,
      Payment,
      Order,
      Contract,
      Vendor,
      User,
      VendorRfqCategory,
      VendorRfqBlacklist,
      Invitation,
      MyVendor,
      Dispute,
      RateReview,
      DeliverySchedule,
    ]),
    UserModule,
    RfqModule,
    UserWalletModule,
    DocumentsModule,
    ContractModule,
    TwilioModule,
    BankModule,
    TemporaryVendorModule,
    ProductModule,
    InvitationModule,
    MyVendorModule,
    DisputeModule,
    RateReviewModule,
  ],
  controllers: [
    VendorController,
    RfqController,
    VendorOrderController,
    ContractController,
    VendorTransactionController,
    AccountController,
    EarningController,
    KycConfirmationsController,
    DashboardController,
  ],
  providers: [
    VendorService,
    UserWalletService,
    VendorRfqService,
    VendorOrderService,
    InvitationService,
    MyVendorService,
    DisputeService,
    RateReviewService,
  ],
  exports: [
    VendorService,
    VendorRfqService,
    VendorOrderService,
    UserWalletService,
  ],
})
export class VendorModule {}

import { EmailModule } from '../email/email.module';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { ProjectTransactionUser } from '../shared-wallet-transaction/shared-transactions.model';
import { UserProjectWallet } from '../shared-wallet-transaction/shared-wallet.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { Module, forwardRef } from '@nestjs/common';
import { ProjectWalletService } from './project-wallet.service';
import { ProjectWalletTransactionService } from '../project-wallet-transaction/project-transaction.service';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { InvitationModule } from '../invitation/invitation.module';
import { UserModule } from '../user/user.module';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { Project } from '../project/models/project.model';
import { ContractModule } from '../contract/contract.module';
import { Contract } from '../contract/models';
import { RfqModule } from '../rfq/rfq.module';
import { RfqService } from '../rfq/rfq.service';
import { MyVendor } from '../my-vendor/models/myVendor.model';
import {
  VendorRfqRequest,
  RfqItem,
  RfqCategory,
  RfqRequest,
  RfqRequestMaterial,
  RfqRequestInvitation,
  RfqBargain,
  RfqQuote,
} from '../rfq/models';
import { EarningService } from '../contract/earning.service';
import { EmailService } from '../email/email.service';
import { MyVendorService } from '../my-vendor/my-vendor.service';
import { Payment } from '../payment/models/payment.model';
import { ProjectModule } from '../project/project.module';
import { PaymentService } from '../payment/payment.service';
import { PaymentModule } from '../payment/payment.module';
import { MyProjectModule } from '../my-project/my-projects.module';
import { MyFundManagerService } from '../my-fundManager/my-fundManager.service';
import { MyFundManager } from '../my-fundManager/models/myFundManager.model';
import { Vendor } from '../vendor/models/vendor.model';
import { OrderModule } from '../order/order.module';
import { Order } from '../order/models';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { Commission } from '../escrow/models/commision.model';
import { Escrow } from '../escrow/models/escrow.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Vendor,
      VendorRfqBlacklist,
      UserUploadMaterial,
      Order,
      RfqQuote,
      Contract,
      UserWallet,
      RfqBargain,
      MyFundManager,
      SharedProject,
      Project,
      Payment,
      User,
      VendorRfqRequest,
      RfqItem,
      RfqCategory,
      RfqRequest,
      RfqRequestMaterial,
      RfqRequestInvitation,
      MyVendor,
      UserTransaction,
      ProjectTransaction,
      ProjectWallet,
      ProjectTransactionUser,
      UserProjectWallet,
      RateReview,
      Commission,
      Escrow,
    ]),
    forwardRef(() => RfqModule),
    forwardRef(() => OrderModule),
    forwardRef(() => ContractModule),
    forwardRef(() => InvitationModule),
    forwardRef(() => RfqModule),
    forwardRef(() => EmailModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => MyProjectModule),
    ContractModule,
    UserModule,
    UserWalletModule,
  ],
  controllers: [],
  providers: [
    ProjectWalletService,
    RfqService,
    RfqService,
    EarningService,
    EmailService,
    MyVendorService,
    ProjectWalletTransactionService,
    MyFundManagerService,
    UserWalletService,
    PaymentService,
  ],
  exports: [
    RfqService,
    EarningService,
    MyVendorService,
    MyFundManagerService,
    ProjectWalletService,
    ProjectWalletTransactionService,
    UserWalletService,
  ],
})
export class ProjectWalletModule {}

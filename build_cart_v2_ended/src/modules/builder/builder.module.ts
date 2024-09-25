import { Module } from '@nestjs/common';
import { BuilderService } from './builder.service';
import { BuilderController } from './builder.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Builder } from './models/builder.model';
import { UserModule } from 'src/modules/user/user.module';
import { BuilderProjectController } from './builder-project.controller';
import { ProjectModule } from 'src/modules/project/project.module';
import { ProfileController } from './profile.controller';
import { RfqModule } from 'src/modules/rfq/rfq.module';
import { VendorModule } from 'src/modules/vendor/vendor.module';
import { MyVendorModule } from 'src/modules/my-vendor/my-vendor.module';
import { RateReviewModule } from 'src/modules/rate-review/rate-review.module';
import { DisputeModule } from '../dispute/dispute.module';
import { DisputeController } from '../admin/dispute.controller';
import { SharedProjectModule } from '../shared-project/shared.module';
import { PaymentModule } from '../payment/payment.module';
import { BuilderPaymentController } from './builder-payment.controller';
import { MyPaymentModule } from '../my-payment/my-payment.module';
import { TwilioModule } from '../twilio/twilio.module';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Project } from '../project/models/project.model';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { PaystackPaymentModule } from '../payment/paystack-payment/paystack-payment.module';
import { MyProject } from '../my-project/models/myProjects.model';
import { MyFundManagerService } from '../my-fundManager/my-fundManager.service';
import { MyFundManager } from '../my-fundManager/models/myFundManager.model';
import { ProjectMediaModule } from '../project-media/project-media.module';
import { ProjectMediaController } from './builder-project-media.controller';
import { ProjectMediaService } from '../project-media/project-media.service';
import { ProjectMedia } from '../project-media/models/project-media.model';
import { OrderModule } from '../order/order.module';
import { BuilderOrderController } from './builder-order.controller';
import { OrderService } from '../order/order.services';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { Order } from '../order/models';
import { Contract } from '../contract/models';
import { Payment } from '../payment/models/payment.model';
import { BuilderWalletService } from './builder-wallet.service';
import { BuilderOrderServices } from './builder-order.services';
import { BuilderWalletController } from './builder-wallet.controller';
import { User } from '../user/models/user.model';
import { ContractService } from '../contract/contract.service';
import { BuilderRfqController } from './builder-rfq.controller';
import { BuilderRfqService } from './builder-rfq.service';
import { BuilderProjectService } from './builder-project.service';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { TeamModule } from '../team/team.module';
import { UserProject } from '../fund-manager/models/shared-project.model';
import { BuilderTransactionController } from './builder-transaction.controller';
import { RfqRequestMaterial } from '../rfq/models';
import { BuilderProject } from '../builder-project/model/builderProject.model';
import { BuilderProjectTenderService } from './builder-tender.service';
import { BuilderTenderController } from './builder-tender.controller';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { MaterialService } from '../material-schedule-upload/material.service';
import { MaterialSchedule } from '../material-schedule-upload/models/material-schedule.model';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { BuilderMaterialController } from './builder-material-schedule.controller';
import { BuilderVendorService } from './builder-vendor-service';
import { Vendor } from '../vendor/models/vendor.model';
import { Bank } from '../bank/models/bank.model';
import { BankModule } from '../bank/bank.module';
import { HttpModule } from '@nestjs/axios';
import { BankService } from '../bank/bank.service';
import { BuilderVendorController } from './vendor.controller';
import { BuilderFundManagerService } from './builder-fundmanager-service';
import { BuilderFundManagerController } from './builder-fundmanager.controller';
import { BuilderFundManager } from '../project/models/builder-fundManager-project.model';
import { Sequelize } from 'sequelize';
import { TenderBid } from '../project/models/project-tender-bids.model';
import { MyVendor } from '../my-vendor/models/myVendor.model';
import { InvitationModule } from '../invitation/invitation.module';
import { MyVendorService } from '../my-vendor/my-vendor.service';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { ProjectFundManager } from '../project-fundManager/model/projectFundManager.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { RateReviewService } from '../rate-review/rate-review.service';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { FundManagerBuilderService } from '../fund-manager/fundManager-builder.service';
import { Invitation } from '../invitation/models/invitation.model';
import { InvitationService } from '../invitation/invitation.service';
import { DisputeService } from '../dispute/dispute.service';
import { Dispute } from '../dispute/models/dispute.model';
import { ProjectShares } from '../project/models/project-shared.model';
import { VendorProductModule } from '../vendor-product/vendor-product.module';
import { VendorProductService } from '../vendor-product/services/vendor-product.service';
import { VendorProduct } from '../vendor-product/models/vendor-product.model';
import { VendorProductSpecification } from '../vendor-product/models/vendor-product-specification.model';
import { VendorProductSpecificationProduct } from '../vendor-product/models/vendor-product-specification-product.model';
import { VendorRfqCategory } from '../vendor/models/vendor-rfqCategory.model';
import { ProductService } from '../product/services/product.service';
import { Product } from '../product/models/product.model';
import { ProductMetric } from '../product/models/metric.model';
import { ProductCategory } from '../product/models/category.model';
import { ProductSpecification } from '../product/models/specification.model';
import { ProductSpecificationProduct } from '../product/models/productSpecification.model';
import { ProductCategoryService } from '../product/services/category.service';
import { ProductMetricService } from '../product/services/metric.service';
import { AuthModule } from '../auth/auth.module';
import { Documents } from '../documents/models/documents.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { Escrow } from '../escrow/models/escrow.model';
import { Commission } from '../escrow/models/commision.model';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { BuilderPortFolio } from './models/builder-portfolio.model';
import { PortFolioMedias } from './models/builder-portfolio-media';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Builder,
      TenderBid,
      MaterialSchedule,
      UserUploadMaterial,
      ProjectTender,
      ProjectShares,
      RfqRequestMaterial,
      TeamMember,
      UserProject,
      User,
      Payment,
      Order,
      Contract,
      FundManager,
      Project,
      MyFundManager,
      SharedProject,
      BuilderProject,
      MyProject,
      ProjectMedia,
      Vendor,
      Bank,
      BuilderFundManager,
      MyVendor,
      UserWallet,
      ProjectFundManager,
      RateReview,
      DeliverySchedule,
      Invitation,
      Dispute,
      Product,
      ProductMetric,
      ProductCategory,
      ProductSpecification,
      ProductSpecificationProduct,
      VendorProduct,
      VendorProductSpecification,
      VendorProductSpecificationProduct,
      VendorRfqCategory,
      Documents,
      ProjectWallet,
      ProjectTransaction,
      Project,
      Escrow,
      Commission,
      UserTransaction,
      BuilderPortFolio,
      PortFolioMedias,
    ]),
    PaymentModule,
    TeamModule,
    UserModule,
    OrderModule,
    UserWalletModule,
    ProjectModule,
    ProjectMediaModule,
    RfqModule,
    VendorModule,
    MyVendorModule,
    // MyFundManagerModule,
    // ContractModule,
    DisputeModule,
    SharedProjectModule,
    MyPaymentModule,
    TwilioModule,
    PaystackPaymentModule,
    BankModule,
    HttpModule,
    InvitationModule,
    RateReviewModule,
    VendorProductModule,
    AuthModule,
  ],
  controllers: [
    BuilderController,
    BuilderProjectController,
    BuilderMaterialController,
    BuilderTenderController,
    ProjectMediaController,
    BuilderRfqController,
    BuilderWalletController,
    BuilderTransactionController,
    BuilderOrderController,
    ProfileController,
    // VendorController,
    // ContractController,
    DisputeController,
    BuilderPaymentController,
    BuilderVendorController,
    BuilderFundManagerController,
  ],
  providers: [
    BuilderService,
    MaterialService,
    BuilderProjectTenderService,
    BuilderRfqService,
    BuilderProjectService,
    BuilderOrderServices,
    ContractService,
    MyFundManagerService,
    ProjectMediaService,
    BuilderWalletService,
    OrderService,
    BuilderVendorService,
    BankService,
    BuilderFundManagerService,
    MyVendorService,
    RateReviewService,
    FundManagerBuilderService,
    InvitationService,
    DisputeService,
    ProductService,
    ProductCategoryService,
    ProductMetricService,
    VendorProductService,
  ],
  exports: [
    BuilderService,
    MaterialService,
    BuilderProjectService,
    ContractService,
    BuilderOrderServices,
    MyFundManagerService,
    ProjectMediaService,
    OrderService,
    BuilderWalletService,
    BankService,
  ],
})
export class BuilderModule {}

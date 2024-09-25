import { Module } from '@nestjs/common';
import { superAdminFundManagerController } from './super-admin-fundManager.controller';
import { SuperAdminFundManagerService } from './super-admin-fundManager.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Team } from '../rbac/models/team.model';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { UserRole } from '../rbac/models/user-role.model';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { MyProject } from '../my-project/models/myProjects.model';
import { Project } from '../project/models/project.model';
import { User } from '../user/models/user.model';
import { TenderBid } from '../project/models/project-tender-bids.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { EmailModule } from '../email/email.module';
import { SponsorModule } from '../fund-manager/fundManager.module';
import { SharedProjectModule } from '../shared-project/shared.module';
import { Role } from '../rbac/models/role.model';
import { Order } from '../order/models';
import { RfqRequest, RfqRequestMaterial } from '../rfq/models';
import { Builder } from '../builder/models/builder.model';
import { Documents } from '../documents/models/documents.model';
import { superAdminBuilderController } from './super-admin-builder.controller';
import { SuperAdminBuilderService } from './super-admin-builder.service';
import { BuilderModule } from '../builder/builder.module';
import { UserModule } from '../user/user.module';
import { RfqModule } from '../rfq/rfq.module';
import { Vendor } from '../vendor/models/vendor.model';
import { Invitation } from '../invitation/models/invitation.model';
import { VendorModule } from '../vendor/vendor.module';
import { superAdminVendorController } from './super-admin-vendor.controller';
import { SuperAdminVendorService } from './super-admin-vendor.service';
import { AdminModule } from '../admin/admin.module';
import { superAdminController } from './super-admin.controller';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { ProjectModule } from '../project/project.module';
import { Dispute } from '../dispute/models/dispute.model';
import { Contract } from '../contract/models';
import { SuperAdminTransactionController } from './super-admin-transactions.controller';
import { SuperAdminTransactionService } from './super-admin-transactions.service';
import { Product } from '../product/models/product.model';
import { SuperAdminProductService } from './super-admin-product-category.service';
import { superAdminProductController } from './super-admin-product-category.controller';
import { ProductCategory } from '../product/models/category.model';
import { VendorProduct } from '../vendor-product/models/vendor-product.model';
import { superAdminPayoutController } from './super-admin-payout.controller';
import { SuperAdminPayoutService } from './super-admin-payout.service';
import { Payment } from '../payment/models/payment.model';
import { UserLog } from '../user-log/models/user-log.model';
import { ProductSpecification } from '../product/models/specification.model';
import { ProductMetric } from '../product/models/metric.model';
import { ProductSpecificationProduct } from '../product/models/productSpecification.model';
import { SuperAdminService } from './super-admin.service';
import { superAdminTeamController } from './super-admin-team.controller';
import { TeamService } from '../team/team.service';
import { Commission } from '../escrow/models/commision.model';
import { BuilderFundManager } from '../project/models/builder-fundManager-project.model';
import { Escrow } from '../escrow/models/escrow.model';
import { ProjectShares } from '../project/models/project-shared.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      FundManager,
      User,
      TenderBid,
      Team,
      TeamMember,
      UserRole,
      SharedProject,
      MyProject,
      Project,
      Role,
      Order,
      RfqRequest,
      Builder,
      Documents,
      Invitation,
      Vendor,
      UserTransaction,
      Dispute,
      Contract,
      Product,
      ProductCategory,
      VendorProduct,
      Payment,
      UserLog,
      ProductMetric,
      ProductSpecification,
      ProductSpecificationProduct,
      RfqRequestMaterial,
      Commission,
      BuilderFundManager,
      Escrow,
      ProjectShares,
    ]),
    EmailModule,
    SponsorModule,
    ProjectModule,
    SharedProjectModule,
    BuilderModule,
    UserModule,
    RfqModule,
    VendorModule,
    AdminModule,
    RfqModule,
  ],
  controllers: [
    superAdminController,
    superAdminFundManagerController,
    superAdminBuilderController,
    superAdminVendorController,
    SuperAdminTransactionController,
    superAdminProductController,
    superAdminPayoutController,
    superAdminTeamController,
  ],
  providers: [
    SuperAdminFundManagerService,
    SuperAdminBuilderService,
    SuperAdminVendorService,
    SuperAdminTransactionService,
    SuperAdminProductService,
    SuperAdminPayoutService,
    SuperAdminService,
    TeamService,
  ],
  exports: [
    SuperAdminFundManagerService,
    SuperAdminBuilderService,
    SuperAdminVendorService,
    SuperAdminTransactionService,
    SuperAdminProductService,
    SuperAdminPayoutService,
    SuperAdminService,
  ],
})
export class superAdminModule {}

import { Module } from '@nestjs/common';

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
import { RfqRequest } from '../rfq/models';
import { Builder } from '../builder/models/builder.model';
import { Documents } from '../documents/models/documents.model';
import { BuilderModule } from '../builder/builder.module';
import { UserModule } from '../user/user.module';
import { RfqModule } from '../rfq/rfq.module';
import { Vendor } from '../vendor/models/vendor.model';
import { Invitation } from '../invitation/models/invitation.model';
import { VendorModule } from '../vendor/vendor.module';
import { AdminModule } from '../admin/admin.module';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { ProjectModule } from '../project/project.module';
import { Dispute } from '../dispute/models/dispute.model';
import { Contract } from '../contract/models';
import { Product } from '../product/models/product.model';
import { supportAdminVerificationController } from './support-admin-verification.controller';
import { ProductCategory } from '../product/models/category.model';
import { SuperAdminVerificationService } from './support-admin-verification.service';
import { supportAdminRecoveryController } from './support-admin-recovery.controller';
import { SupportAdminRecoveryService } from './support-admin-recovery.service';
import { SupportAdminDisputeController } from './support-admin-dispute.controller';
import { SupportAdminDisputeService } from './support-admin-dispute.service';
import { SupportAdminService } from './support-admin-account.service';
import { SupportAdminController } from './support-admin-account.controller';
import { UserLogModule } from '../user-log/user-log.module';
import { UserLog } from '../user-log/models/user-log.model';
import { UserLogService } from '../user-log/user-log.service';
import { Escrow } from '../escrow/models/escrow.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      FundManager,
      UserLog,
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
      Escrow,
      UserWallet,
    ]),
    EmailModule,
    UserLogModule,
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
    supportAdminVerificationController,
    supportAdminRecoveryController,
    SupportAdminDisputeController,
    SupportAdminController,
  ],
  providers: [
    SuperAdminVerificationService,
    SupportAdminRecoveryService,
    SupportAdminDisputeService,
    SupportAdminService,
    UserLogService,
  ],
  exports: [
    SuperAdminVerificationService,
    SupportAdminRecoveryService,
    SupportAdminDisputeService,
    SupportAdminService,
    UserLogService,
  ],
})
export class supportAdminModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module';

import { ProjectModule } from '../project/project.module';
import { SharedProjectModule } from '../shared-project/shared.module';
import { MyProjectModule } from '../my-project/my-projects.module';
// import { SponsorMyProjectController } from './my-project.controller';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { RfqQuote, RfqRequest } from '../rfq/models';
import { Contract } from '../contract/models';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { ProjectTransactionUser } from '../shared-wallet-transaction/shared-transactions.model';
import { UserProjectWallet } from '../shared-wallet-transaction/shared-wallet.model';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { ProjectWalletModule } from '../project-wallet/project-wallet.module';
import { User } from '../user/models/user.model';

import { Permission } from '../rbac/models/permission';
import { Role } from '../rbac/models/role.model';
import { UserRole } from '../rbac/models/user-role.model';
import { RolePermission } from '../rbac/models/role-permision.model';
import { Resource } from '../rbac/models/resource.model';
import PermissionResource from '../rbac/models/permission-resources.model';
import { Team } from '../rbac/models/team.model';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { TeamMemberRoles } from '../rbac/models/team-member-role.model';
import { RbacModule } from '../rbac/rbac.module';
import { Builder } from '../builder/models/builder.model';
import { Project } from '../project/models/project.model';
import { UserProject } from './models/shared-project.model';
import { ProjectMediaService } from '../project-media/project-media.service';
import { ProjectMedia } from '../project-media/models/project-media.model';
import { RfqModule } from '../rfq/rfq.module';
import { Order } from '../order/models';
import { OrderModule } from '../order/order.module';
import { OrderService } from '../order/order.services';
import { Payment } from '../payment/models/payment.model';
import { Vendor } from '../vendor/models/vendor.model';
import { VendorService } from '../vendor/vendor.service';
import { VendorModule } from '../vendor/vendor.module';
import { ContractModule } from '../contract/contract.module';
import { TwilioModule } from '../twilio/twilio.module';
import { TwilioService } from '../twilio/twilio.service';
import { DocumentsModule } from '../documents/documents.module';
import { VendorRfqCategory } from '../vendor/models/vendor-rfqCategory.model';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import { TemporaryVendorModule } from '../temporary-vendor/temporary-vendor.module';
import { SponsorOrderServices } from './fundManager-order.services';
import { SponsorRfqService } from './fundManager-rfq.service';
import { SponsorVendorController } from './fundManger-vendor.controller';
import { SponsorWalletController } from './fundManager-wallet.controller';
import { SponsorWalletService } from './fundManager-wallet.services';
import { OrderController } from './fundManager-oreder-controller';
import { BuilderFundManager } from '../project/models/builder-fundManager-project.model';
import { MyFundManager } from '../my-fundManager/models/myFundManager.model';
import { ProjectFundManager } from '../project-fundManager/model/projectFundManager.model';
import { FundManager } from './models/fundManager.model';
import { SponsorProjectMediaController } from './fundManager-project-media.controller';
import { ProjectController } from './fundManager-project.controller';
import { FundManagerProjectService } from './fundManager-project.services';
import { SponsorRolesController } from './fundManager-rbac.controller';
import { SponsorRolesService } from './fundManager-rbac.services';
import { SponsorRfqController } from './fundManager-rfq.controller';
import { SponsorTeamMemberService } from './fundManager-team-member.service';
import { SponsorTeamController } from './fundManager-team.controller';
import { SponsorTeamService } from './fundManager-team.service';
import { SponsorTransactionController } from './fundManager-transaction.controller';
import { UserProjectService } from './fundManager-userproject.service';
import { SponsorController } from './fundManager.controller';
import { FundManagerService } from './fundManager.service';
import { Invitation } from '../invitation/models/invitation.model';
import { FundManagerBuilderService } from './fundManager-builder.service';
import { FundManagerBuilderController } from './fundManager-builder.controller';
import { BuilderProject } from '../builder-project/model/builderProject.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { RateReviewModule } from '../rate-review/rate-review.module';
import { InvitationModule } from '../invitation/invitation.module';
import { ProjectTender } from './models/project-tender.model';
import { GroupName } from '../project/models/group-name.model';
import { TenderBid } from '../project/models/project-tender-bids.model';
import { ProjectShares } from '../project/models/project-shared.model';
import { Documents } from '../documents/models/documents.model';
import { Escrow } from '../escrow/models/escrow.model';
import { Commission } from '../escrow/models/commision.model';
import { DisputeModule } from '../dispute/dispute.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Builder,
      RfqQuote,
      VendorRfqBlacklist,
      VendorRfqCategory,
      Vendor,
      Contract,
      Payment,
      Order,
      ProjectMedia,
      UserProject,
      Project,
      TeamMember,
      Team,
      TeamMemberRoles,
      User,
      PermissionResource,
      Resource,
      RolePermission,
      Permission,
      Role,
      UserRole,
      MyFundManager,
      BuilderFundManager,
      ProjectFundManager,
      FundManager,
      SharedProject,
      RfqRequest,
      Contract,
      UserWallet,
      UserTransaction,
      ProjectTransaction,
      ProjectWallet,
      ProjectTransactionUser,
      UserProjectWallet,
      Invitation,
      BuilderProject,
      ProjectTender,
      GroupName,
      RateReview,
      TenderBid,
      ProjectShares,
      Documents,
      Escrow,
      Commission,
    ]),
    UserModule,
    ProjectWalletModule,
    ContractModule,
    TwilioModule,
    DocumentsModule,
    VendorModule,
    OrderModule,
    RfqModule,
    RbacModule,
    ProjectModule,
    SharedProjectModule,
    MyProjectModule,
    UserWalletModule,
    TemporaryVendorModule,
    UserWalletModule,
    TemporaryVendorModule,
    RateReviewModule,
    InvitationModule,
    DisputeModule,
  ],
  providers: [
    TwilioService,
    SponsorOrderServices,
    SponsorWalletService,
    SponsorRfqService,
    VendorService,
    OrderService,
    UserProjectService,
    ProjectMediaService,
    SponsorTeamService,
    FundManagerService,
    FundManagerProjectService,
    SponsorRolesService,
    SponsorTeamMemberService,
    UserWalletService,
    FundManagerBuilderService,
    SponsorTransactionController,
  ],
  controllers: [
    SponsorController,
    ProjectController,
    SponsorProjectMediaController,
    SponsorRfqController,
    OrderController,
    SponsorVendorController,
    SponsorTeamController,
    SponsorRolesController,
    // SponsorMyProjectController,
    SponsorWalletController,
    SponsorTransactionController,
    FundManagerBuilderController,
  ],
  exports: [
    VendorService,
    SponsorOrderServices,
    SponsorRfqService,
    SponsorRolesService,
    VendorService,
    OrderService,
    ProjectMediaService,
    SponsorWalletService,
    FundManagerProjectService,
    SponsorTeamMemberService,
    FundManagerService,
    UserWalletService,
    SponsorTransactionController,
  ],
})
export class SponsorModule {}

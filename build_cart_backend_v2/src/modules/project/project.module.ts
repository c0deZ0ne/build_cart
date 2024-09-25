import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectService } from './project.service';
import { Project } from './models/project.model';
import { SharedProjectModule } from '../shared-project/shared.module';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import { ProjectWalletModule } from '../project-wallet/project-wallet.module';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { UserModule } from '../user/user.module';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { ProjectTransactionUser } from '../shared-wallet-transaction/shared-transactions.model';
import { ContractService } from '../contract/contract.service';
import { ContractModule } from '../contract/contract.module';
import { Contract } from '../contract/models';
import { RfqModule } from '../rfq/rfq.module';
// import { SharedProjectService } from '../shared-project/service';
import { Payment } from '../payment/models/payment.model';
import { InvitationService } from '../invitation/invitation.service';
import { InvitationModule } from '../invitation/invitation.module';
import { Invitation } from '../invitation/models/invitation.model';
import {
  RfqCategory,
  RfqItem,
  RfqRequest,
  RfqRequestInvitation,
  RfqRequestMaterial,
  VendorRfqRequest,
} from '../rfq/models';
import { MyVendor } from '../my-vendor/models/myVendor.model';
import { PaymentModule } from '../payment/payment.module';
import { MyProject } from '../my-project/models/myProjects.model';
import { User } from '../user/models/user.model';
import { MyFundManager } from '../my-fundManager/models/myFundManager.model';
import { ProjectMedia } from '../project-media/models/project-media.model';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { ProjectShares } from './models/project-shared.model';
import { TenderBid } from './models/project-tender-bids.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Builder } from '../builder/models/builder.model';
import { ProjectMediaService } from '../project-media/project-media.service';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { MaterialScheduleModule } from '../material-schedule-upload/material-schedule.module';
import { ProjectGroupService } from './group.service';
import { GroupName } from './models/group-name.model';
import { ProjectGroup } from './models/project-group';
import { ProjectGroupController } from './group.controller';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { ProjectSharesService } from './share.service';
import { ProjectSharesController } from './share.controller';
import { Documents } from '../documents/models/documents.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { PaystackPaymentModule } from '../payment/paystack-payment/paystack-payment.module';
import { ProjectController } from './project.controller';
import { Commission } from '../escrow/models/commision.model';
import { Escrow } from '../escrow/models/escrow.model';
import { Order } from '../order/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      RfqCategory,
      GroupName,
      ProjectGroup,
      UserUploadMaterial,
      FundManager,
      Builder,
      TenderBid,
      ProjectShares,
      ProjectTender,
      MyFundManager,
      RfqRequest,
      MyProject,
      User,
      Project,
      Invitation,
      Payment,
      Contract,
      ProjectWallet,
      SharedProject,
      UserWallet,
      UserTransaction,
      ProjectTransactionUser,
      Contract,
      Payment,
      VendorRfqRequest,
      RfqItem,
      RfqCategory,
      RfqRequest,
      RfqRequestMaterial,
      RfqRequestInvitation,
      MyVendor,
      ProjectMedia,
      DeliverySchedule,
      Documents,
      ProjectTransaction,
      Commission,
      Escrow,
      Order,
    ]),
    forwardRef(() => PaymentModule),
    forwardRef(() => SharedProjectModule),
    forwardRef(() => ProjectWalletModule),
    forwardRef(() => ContractModule),
    forwardRef(() => RfqModule),
    forwardRef(() => SharedProjectModule),
    forwardRef(() => InvitationModule),
    forwardRef(() => ProjectWalletModule),
    MaterialScheduleModule,
    UserWalletModule,
    UserModule,
    PaystackPaymentModule,
  ],
  controllers: [
    ProjectGroupController,
    ProjectSharesController,
    ProjectController,
  ],
  providers: [
    ProjectService,
    ProjectSharesService,
    ProjectMediaService,
    UserWalletService,
    ProjectWalletService,
    ProjectGroupService,
    // SharedProjectService,
    InvitationService,
    ContractService,
  ],
  exports: [
    InvitationService,
    ProjectGroupService,
    ProjectService,
    ProjectMediaService,
    // SharedProjectService,
    UserWalletService,
    ProjectWalletService,
    ContractService,
  ],
})
export class ProjectModule {}

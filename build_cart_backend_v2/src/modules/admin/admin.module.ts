import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ContractController } from './contract.controller';
import { ContractModule } from 'src/modules/contract/contract.module';
import { TicketController } from './ticket.controller';
import { TicketModule } from 'src/modules/ticket/ticket.module';
import { RfqController } from './rfq.controller';
import { RfqModule } from 'src/modules/rfq/rfq.module';
import { UserController } from './user.controller';
import { UserModule } from 'src/modules/user/user.module';
import { RateReviewModule } from 'src/modules/rate-review/rate-review.module';
import { BankModule } from 'src/modules/bank/bank.module';
import { VendorModule } from 'src/modules/vendor/vendor.module';
import { BuilderModule } from 'src/modules/builder/builder.module';
import { TransactionController } from './transaction.controller';
import { DisputeController } from './dispute.controller';
import { DisputeModule } from '../dispute/dispute.module';
import { PriceController } from './priceList.controller';
import { PriceListModule } from '../price-list/price-list.module';
import { SponsorModule } from '../fund-manager/fundManager.module';
import { SponsorController } from './fundManager.controller';
import { InvitationModule } from '../invitation/invitation.module';
import { InvitationController } from './invitation.controller';
import { BlogController } from './blog.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubBlog } from '../blog/models/subBlog.model';
import { Blog } from '../blog/models/blog.model';
import { SharedProjectModule } from '../shared-project/shared.module';
import { ProjectModule } from '../project/project.module';
import { AdminProjectService } from './admin.project.service';
import { Invitation } from '../invitation/models/invitation.model';
import { Project } from '../project/models/project.model';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { User } from '../user/models/user.model';
import { Builder } from '../builder/models/builder.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { AdminControllerPayment } from './admin.payment.service';
import { MyProject } from '../my-project/models/myProjects.model';
import { RbacModule } from '../rbac/rbac.module';
import { AdminRolesController } from './admin-systemroles.controller';
import { AdminRolesService } from './admin-rbac.service';
import { Role } from '../rbac/models/role.model';
import { Permission } from '../rbac/models/permission';
import { UserRole } from '../rbac/models/user-role.model';
import { RolePermission } from '../rbac/models/role-permision.model';
import PermissionResource from '../rbac/models/permission-resources.model';
import { Resource } from '../rbac/models/resource.model';
import { EmailModule } from '../email/email.module';
import { AdminVendorController } from './admin-vendor-controller';
import { AdminVendorService } from './admin-vendor.services';
import { Vendor } from '../vendor/models/vendor.model';
import { AdminProjectController } from './admin-project.controller';
import { Contract } from '../contract/models';
import { Order } from '../order/models';
import { OrderModule } from '../order/order.module';
import { AdminBuilderController } from './admin-builder.controller';
import { AdminBuilderService } from './admin-builder.services';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Role,
      Contract,
      Order,
      FundManager,
      Vendor,
      User,
      Builder,
      Permission,
      UserRole,
      RolePermission,
      PermissionResource,
      Resource,
      Blog,
      SubBlog,
      User,
      Builder,
      FundManager,
      Invitation,
      Project,
      SharedProject,
      MyProject,
    ]),
    PaymentModule,
    BuilderModule,
    RbacModule,
    OrderModule,
    ContractModule,
    EmailModule,
    ProjectModule,
    VendorModule,
    ContractModule,
    TicketModule,
    RfqModule,
    UserModule,
    RateReviewModule,
    BankModule,
    DisputeModule,
    PriceListModule,
    InvitationModule,
    SponsorModule,
    UserModule,
    ProjectModule,
    SharedProjectModule,
  ],
  controllers: [
    AdminController,
    AdminRolesController,
    AdminControllerPayment,
    BlogController,
    AdminProjectController,
    ContractController,
    DisputeController,
    InvitationController,
    PriceController,
    RfqController,
    SponsorController,
    AdminBuilderController,
    AdminVendorController,
    TicketController,
    TransactionController,
    UserController,
  ],
  providers: [
    AdminService,
    AdminProjectService,
    AdminVendorService,
    AdminProjectService,
    AdminRolesService,
    AdminBuilderService,
  ],
  exports: [
    AdminService,
    AdminVendorService,
    AdminProjectService,
    AdminRolesService,
    AdminBuilderService,
  ],
})
export class AdminModule {}

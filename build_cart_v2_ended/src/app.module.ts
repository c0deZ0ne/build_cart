import * as morgan from 'morgan';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectModule } from './modules/project/project.module';
import { RfqModule } from './modules/rfq/rfq.module';
import { BrandModule } from './modules/brand/brand.module';
import { BankModule } from './modules/bank/bank.module';
import { CategoryModule } from './modules/category/category.module';
import { AdminModule } from './modules/admin/admin.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { TeamModule } from './modules/team/team.module';
import { ChatModule } from './modules/chat/chat.module';
import { MigrationModule } from './modules/v1/migration.module';
import { PriceListModule } from './modules/price-list/price-list.module';
import { OpenApiModule } from './modules/open-api/open-api.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import { SponsorModule } from './modules/fund-manager/fundManager.module';
import { SharedProjectModule } from './modules/shared-project/shared.module';
import { MyProjectModule } from './modules/my-project/my-projects.module';
import { PaymentModule } from './modules/payment/payment.module';
// import { BaniPaymentModule } from './modules/payment/bani-payment/bani-payment.module';
// import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { BlogModule } from './modules/blog/blog.module';
import { MyPaymentModule } from './modules/my-payment/my-payment.module';
import { TwilioModule } from './modules/twilio/twilio.module';
import { ProjectWalletModule } from './modules/project-wallet/project-wallet.module';
import { ContractModule } from './modules/contract/contract.module';
import { ProjectWalletTransactionModule } from './modules/project-wallet-transaction/project-transaction.module';
import { UseTransactionModule } from './modules/user-wallet-transaction/user-transaction.module';
import { UserWalletModule } from './modules/user-wallet/user-wallet.module';
import { RetailModule } from './modules/retail/retail.module';
import { ProductModule } from './modules/product/product.module';
import { LabourHackModule } from './modules/labour-hack/labour-hack.module';
import { OrderModule } from './modules/order/order.module';
import { VendorProductModule } from './modules/vendor-product/vendor-product.module';
import { TemporaryVendorModule } from './modules/temporary-vendor/temporary-vendor.module';
import { BuilderModule } from './modules/builder/builder.module';
import { MaterialScheduleModule } from './modules/material-schedule-upload/material-schedule.module';
import { superAdminModule } from './modules/super-admin/super-admin.module';
import { NotificationModule } from './modules/notification/notification.module';
import { UserLogModule } from './modules/user-log/user-log.module';
import { supportAdminModule } from './modules/suport-admin/support-admin.module';
import { EscrowModule } from './modules/escrow/escrow.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    BuilderModule,
    BankModule,
    MaterialScheduleModule,
    OrderModule,
    // BaniPaymentModule,
    BlogModule,
    BrandModule,
    CategoryModule,
    ChatModule,
    NotificationModule,
    ContractModule,
    DatabaseModule,
    InvitationModule,
    MyPaymentModule,
    MyProjectModule,
    OpenApiModule,
    PaymentModule,
    PriceListModule,
    ProjectModule,
    ProjectWalletModule,
    ProjectWalletTransactionModule,
    RfqModule,
    SharedProjectModule,
    SponsorModule,
    TeamModule,
    TicketModule,
    TwilioModule,
    UseTransactionModule,
    UserWalletModule,
    UserModule,
    VendorModule,
    // WebhooksModule,
    MigrationModule,
    TwilioModule,
    RetailModule,
    ProductModule,
    LabourHackModule,
    VendorProductModule,
    TemporaryVendorModule,
    superAdminModule,
    UserLogModule,
    supportAdminModule,
    EscrowModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(morgan('tiny')).forRoutes('*');
  }
}

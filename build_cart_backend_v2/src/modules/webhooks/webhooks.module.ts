import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MyPayment } from '../my-payment/models/myPayments.model';
import { Contract } from '../contract/models';
import { Payment } from '../payment/models/payment.model';
import { PaymentModule } from '../payment/payment.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.sevice';
import { PaymentService } from '../payment/payment.service';
import { PaystackPaymentModule } from '../payment/paystack-payment/paystack-payment.module';
import { Project } from '../project/models/project.model';
import { Order } from '../order/models';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { RemitaPaymentService } from '../payment/remiter-payment/remitter-payment.service';
import { RemitterPaymentModule } from '../payment/remiter-payment/remitter-payment.module';
import { Commission } from '../escrow/models/commision.model';
import { Escrow } from '../escrow/models/escrow.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { PlatformSubscriptionModule } from '../platfrom-subscription/platform-subscription.module';
import { ContractModule } from '../contract/contract.module';
import { ProjectPaymentModule } from '../payment/project-payment/project-payment.module';
@Module({
  imports: [
    SequelizeModule.forFeature([
      MyPayment, Contract,
      Payment,
      Project,
      Payment,
      Order,
      ProjectWallet,
      UserWallet,
      Commission,
      Escrow,
      ProjectTransaction
    ]),
    RemitterPaymentModule,
    PaystackPaymentModule,
    PlatformSubscriptionModule,
    ContractModule,
    UserWalletModule,
    ProjectPaymentModule
  ],
  controllers: [WebhookController],
  providers: [WebhookService,PaymentService,RemitaPaymentService],
  exports: [ WebhookService,PaymentService,RemitaPaymentService],
})
export class WebhooksModule {}

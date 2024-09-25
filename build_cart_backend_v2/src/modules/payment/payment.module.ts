import { Module, forwardRef } from '@nestjs/common';
// import { BaniPaymentService } from './bani-payment/bani-payment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { MyPayment } from '../my-payment/models/myPayments.model';
import { Contract } from '../contract/models';
import { Payment } from './models/payment.model';
// import { BaniPaymentModule } from './bani-payment/bani-payment.module';
import { CutstructPayModule } from './cutstuct-payment/cutstruct-payment.module';
import { CutstructPayService } from './cutstuct-payment/custruct-payment.service';
import { PaymentService } from './payment.service';
import { EmailModule } from '../email/email.module';
import { PaystackPaymentService } from './paystack-payment/paystack-payment.service';
import { PaystackPaymentModule } from './paystack-payment/paystack-payment.module';
import { RfqBargain } from '../rfq/models';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import { RemitaPaymentService } from './remiter-payment/remitter-payment.service';
import { RemitterPaymentModule } from './remiter-payment/remitter-payment.module';
import { Order } from '../order/models';
import { ContractModule } from '../contract/contract.module';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { PlatformSubscriptionModule } from '../platfrom-subscription/platform-subscription.module';
import { SystemPaymentController } from './payment.controller';
import { ProjectWalletModule } from '../project-wallet/project-wallet.module';
import { Subscription } from '../platfrom-subscription/model/subscription.model';
import { VaultPaymentModule } from './vault-payment/vault-payment.module';
import { VaultPaymentService } from './vault-payment/vault-payment.service';
import { Commission } from '../escrow/models/commision.model';
import { Escrow } from '../escrow/models/escrow.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { Project } from '../project/models/project.model';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { ProjectPaymentModule } from './project-payment/project-payment.module';
import { ProjectPaymentService } from './project-payment/project-payment.service';
import { User } from '../user/models/user.model';
@Module({
  imports: [
    SequelizeModule.forFeature([
      ProjectTransaction,
      Payment,
      User,
      Contract,
      UserWallet,
      Order,
      RfqBargain,
      VendorRfqBlacklist,
      Subscription,
      Project,
      Commission,
      ProjectWallet,
      UserTransaction,
      Escrow,

    ]),
    forwardRef(() => ContractModule),
    forwardRef(() => PlatformSubscriptionModule),
    forwardRef(() => CutstructPayModule),
    forwardRef(() => PaystackPaymentModule),
    forwardRef(() => RemitterPaymentModule),
    forwardRef(() => UserWalletModule),
    forwardRef(()=> ProjectWalletModule),
    forwardRef(() => VaultPaymentModule),
    forwardRef(()=>PaymentModule),
    forwardRef(()=>ProjectPaymentModule),
    EmailModule,
  ],
  providers: [
    PaymentService,
    PaystackPaymentService,
    CutstructPayService,
    UserWalletService,
    RemitaPaymentService,
    VaultPaymentService,
    ProjectPaymentService,
  ],
  controllers:[SystemPaymentController],
  exports: [
    VaultPaymentService,
    CutstructPayService,
    PaystackPaymentService,
    PaymentService,
    RemitaPaymentService,
    UserWalletService,
    ProjectPaymentService
  ]
})
export class PaymentModule {}

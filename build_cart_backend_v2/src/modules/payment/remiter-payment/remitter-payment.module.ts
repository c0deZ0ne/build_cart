import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RemitaPaymentService } from './remitter-payment.service';
import { Payment } from '../models/payment.model';
import { PaymentModule } from '../payment.module';
import { Contract } from 'src/modules/contract/models';
import { Order } from 'src/modules/order/models';
import { EmailModule } from 'src/modules/email/email.module';
import { ContractModule } from 'src/modules/contract/contract.module';
import { PlatformSubscriptionModule } from 'src/modules/platfrom-subscription/platform-subscription.module';
import { UserWalletModule } from 'src/modules/user-wallet/user-wallet.module';
import { Commission } from 'src/modules/escrow/models/commision.model';
import { Escrow } from 'src/modules/escrow/models/escrow.model';
import { ProjectTransaction } from 'src/modules/project-wallet-transaction/models/project-transaction.model';
import { ProjectWallet } from 'src/modules/project-wallet/models/project-wallet.model';
import { Project } from 'src/modules/project/models/project.model';
import { RfqBargain } from 'src/modules/rfq/models';
import { UserTransaction } from 'src/modules/user-wallet-transaction/models/user-transaction.model';
import { UserWallet } from 'src/modules/user-wallet/models/user-wallet.model';
import { VendorRfqBlacklist } from 'src/modules/vendor/models/vendor-rfqBlacklist';
import { Subscription } from 'src/modules/platfrom-subscription/model/subscription.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Payment,
      Contract,
      UserWallet,
      Order, 
      RfqBargain,
      VendorRfqBlacklist,
      Subscription,
      Project,
      Commission,
      ProjectWallet,
      ProjectTransaction,
      UserTransaction,
      Escrow,
    ]),
    forwardRef(() => PaymentModule),
    forwardRef(() => ContractModule),
    forwardRef(() => PlatformSubscriptionModule),
    forwardRef(() => UserWalletModule),
    EmailModule,

  ],
  controllers: [],
  providers: [RemitaPaymentService],
  exports: [RemitaPaymentService],
})
export class RemitterPaymentModule {}

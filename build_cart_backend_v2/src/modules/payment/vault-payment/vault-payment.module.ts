import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {  VaultPaymentService } from './vault-payment.service';
import { Payment } from '../models/payment.model';
import { PaymentModule } from '../payment.module';
import { Contract } from 'src/modules/contract/models';
import { ContractModule } from 'src/modules/contract/contract.module';
import { PlatformSubscriptionModule } from 'src/modules/platfrom-subscription/platform-subscription.module';
import { UserWalletModule } from 'src/modules/user-wallet/user-wallet.module';
import { Order } from 'src/modules/order/models';
import { ProjectWallet } from 'src/modules/project-wallet/models/project-wallet.model';
import { ProjectTransaction } from 'src/modules/project-wallet-transaction/models/project-transaction.model';
import { UserWallet } from 'src/modules/user-wallet/models/user-wallet.model';
import { UserTransaction } from 'src/modules/user-wallet-transaction/models/user-transaction.model';
import { Project } from 'src/modules/project/models/project.model';
import { Commission } from 'src/modules/escrow/models/commision.model';
import { Escrow } from 'src/modules/escrow/models/escrow.model';
import { ProjectWalletModule } from 'src/modules/project-wallet/project-wallet.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Payment, Contract,
      Project,Commission,
      Order, ProjectWallet,
      ProjectTransaction, UserWallet,
      UserTransaction,Escrow,
    ]),
    forwardRef(() => PaymentModule),
     forwardRef(()=>ProjectWalletModule),
    forwardRef(() => ContractModule),
    forwardRef(() => PlatformSubscriptionModule),
    forwardRef(() => UserWalletModule),
  ],
  controllers: [],
  providers: [VaultPaymentService],
  exports: [VaultPaymentService],
})
export class VaultPaymentModule {}

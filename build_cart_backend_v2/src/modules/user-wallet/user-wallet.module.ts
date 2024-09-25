import { MyProject } from '../my-project/models/myProjects.model';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { ProjectTransactionUser } from '../shared-wallet-transaction/shared-transactions.model';
import { UserProjectWallet } from '../shared-wallet-transaction/shared-wallet.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { Module } from '@nestjs/common';
import { UserWalletService } from './user-wallet.service';
import { UserTransactionService } from '../user-wallet-transaction/user-transaction.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      MyProject,
      SharedProject,
      UserWallet,
      UserTransaction,
      ProjectTransaction,
      ProjectWallet,
      ProjectTransactionUser,
      UserProjectWallet,
    ]),
  ],
  controllers: [],
  providers: [UserWalletService, UserTransactionService],
  exports: [UserWalletService, UserTransactionService],
})
export class UserWalletModule {}

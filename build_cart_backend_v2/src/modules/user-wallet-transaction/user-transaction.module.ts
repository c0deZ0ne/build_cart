import { EmailModule } from '../email/email.module';
import { MyProject } from '../my-project/models/myProjects.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { ProjectTransactionUser } from '../shared-wallet-transaction/shared-transactions.model';
import { UserProjectWallet } from '../shared-wallet-transaction/shared-wallet.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { Module } from '@nestjs/common';
import { UserTransactionService } from './user-transaction.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      MyProject,
      UserWallet,
      UserTransaction,
      ProjectTransaction,
      ProjectWallet,
      ProjectTransactionUser,
      UserProjectWallet,
    ]),
    EmailModule,
  ],
  controllers: [],
  providers: [UserTransactionService],
  exports: [UserTransactionService],
})
export class UseTransactionModule {}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreationAttributes,
  Transaction as SequelizeTransaction,
} from 'sequelize';
import { ProjectTransaction } from './models/project-transaction.model';

@Injectable()
export class ProjectWalletTransactionService {
  constructor(
    @InjectModel(ProjectTransaction)
    private readonly projectTransaction: typeof ProjectTransaction,
  ) {}

  async createProjectTransaction(
    transactionData: CreationAttributes<ProjectTransaction>,
    dbTransaction: SequelizeTransaction,
  ): Promise<ProjectTransaction> {
    return await this.projectTransaction.create(transactionData, {
      transaction: dbTransaction,
    });
  }

  async getProjectTransactions(
    projectWalletId: string,
  ): Promise<ProjectTransaction[]> {
    return await this.projectTransaction.findAll({
      where: {
        walletId: projectWalletId,
      },
    });
  }
}

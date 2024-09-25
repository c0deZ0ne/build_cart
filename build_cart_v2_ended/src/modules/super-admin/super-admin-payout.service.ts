import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from '../vendor/models/vendor.model';
import { Builder } from '../builder/models/builder.model';
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
  UserTransaction,
} from '../user-wallet-transaction/models/user-transaction.model';
import { Bank } from '../bank/models/bank.model';
import { User } from '../user/models/user.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';

@Injectable()
export class SuperAdminPayoutService {
  constructor(
    @InjectModel(UserTransaction)
    private readonly userTransactionModel: typeof UserTransaction,
  ) {}

  async getPayouts() {
    const payouts = await this.userTransactionModel.findAll({
      where: {
        type: TransactionType.WITHDRAWAL,
      },
      attributes: [
        'id',
        'UserWalletId',
        'amount',
        'paymentPurpose',
        'paymentMethod',
        'reference',
        'paymentProvider',
        'paymentType',
        'status',
        'createdAt',
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'userType'],
          include: [
            {
              model: Vendor,
              attributes: [
                'id',
                'email',
                'businessName',
                'businessSize',
                'businessAddress',
              ],
              include: [{ model: Bank }],
            },
            {
              model: Builder,
              attributes: [
                'id',
                'email',
                'businessName',
                'businessSize',
                'businessAddress',
              ],
              include: [{ model: Bank }],
            },
          ],
        },
        {
          model: UserWallet,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    let totalPendingPayout = 0;
    let totalCompletedPayout = 0;
    const completedPayouts = [];
    const pendingPayouts = [];
    payouts.map((pay) => {
      if (pay.status === TransactionStatus.PENDING) {
        totalPendingPayout += Number(pay.amount);
        pendingPayouts.push(pay);
      }
      if (pay.status === TransactionStatus.COMPLETED) {
        totalCompletedPayout += Number(pay.amount);
        completedPayouts.push(pay);
      }
    });

    return {
      totalPendingPayout,
      totalPendingPayoutVolume: pendingPayouts.length,
      totalCompletedPayout,
      totalCompletedPayoutVolume: completedPayouts.length,
      pendingPayouts,
      completedPayouts,
    };
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreationAttributes,
  Transaction as SequelizeTransaction,
  Transaction,
} from 'sequelize';
import { UserWallet } from './models/user-wallet.model';
import {
  PaymentMethod,
  PaymentProvider,
  PaymentPurpose,
  TransactionStatus,
  TransactionType,
} from '../user-wallet-transaction/models/user-transaction.model';
import { User } from '../user/models/user.model';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { UserTransactionService } from '../user-wallet-transaction/user-transaction.service';
import { genAccountNumber, generateTransactionNumber } from 'src/util/util';
import { RfqRequestPaymentTerm } from '../rfq/models';
@Injectable()
export class UserWalletService {
  constructor(
    @InjectModel(UserWallet)
    private readonly userWallet: typeof UserWallet,
    private readonly userTransactionService: UserTransactionService,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {}

  async createWallet(
    userWallet: CreationAttributes<UserWallet>,
    dbTransaction?: SequelizeTransaction,
  ): Promise<UserWallet> {
    const wallet = await this.userWallet.create(userWallet, {
      transaction: dbTransaction,
    });
    return wallet;
  }

  async getWalletForUser(user: User): Promise<UserWallet> {
    const wallet = await this.userWallet.findOrThrow({
      where: { id: user.walletId },
    });
    return wallet;
  }

  async getWalletForUserAccountNumber(account_number: bigint) {
    const wallet = await this.userWallet.findOrThrow({
      where: { account_number },
    });
    return wallet;
  }

  async fundWallet({
    amount,
    dbTransaction,
    paymentMethod,
    transactionStatus,
    paymentProvider,
    description,
    user,
    meta,
    ref,
    itemName
  }: {
    amount: GLfloat;
    account_number?: bigint;
    meta?: Record<string, string>;
    paymentMethod?: PaymentMethod;
    paymentProvider?: PaymentProvider;
    itemName?:string;
    description: string;
    transactionStatus?: TransactionStatus;
    dbTransaction?: SequelizeTransaction;
    user: User;
    ref?: string;
    
  }) {
    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }
    try {
      if (ref) {
        const checkExist =
          await this.userTransactionService.checkTransactionWithPayRef(ref);
        if (checkExist) throw new Error('transaction already used');
      }
      const wallet = await this.getWalletForUser(user);
      if (!wallet) {
        throw new Error("Wallet not found'");
      }
      const curr = Number(wallet?.balance);
      const total = curr + Number(amount);
      wallet.balance = total;
      const totalCredited = Number(wallet?.totalCredit);
      const CurrentTotalCredited = totalCredited + Number(amount);
      wallet.totalCredit = CurrentTotalCredited;
      await wallet.save({ transaction: dbTransaction });
      await this.userTransactionService.createUserTransaction(
        {
          amount,
          type: TransactionType.DEPOSIT,
          UserWalletId: wallet.id,
          status: TransactionStatus[`${transactionStatus}`],
          paymentProvider,
          meta,
          itemName,
          paymentMethod:
            PaymentMethod[`${paymentMethod}`] || PaymentMethod.CUTSTRUCT_PAY,
          paymentPurpose: PaymentPurpose.WALLET,
          CreatedById: wallet.UserId,
          description,
          reference: ref ? ref : generateTransactionNumber(),
        },
        dbTransaction,
      );
      await dbTransaction.commit();
      return wallet;
    } catch (error) {
      await dbTransaction.rollback();
      throw new Error(error.message);
    }
  }

  async transferFundFromUserWallet({
    amount,
    dbTransaction,
    ProjectId,
    paymentPurpose,
    description,
    paymentProvider,
    RfqRequestId,
    user,
  }: {
    amount: GLfloat;
    account_number?: bigint;
    pin?: string;
    ProjectId: string;
    paymentPurpose?: PaymentPurpose;
    dbTransaction: SequelizeTransaction;
    description?: string;
    paymentProvider?: PaymentProvider;
    RfqRequestId?: string;
    user: User;
  }): Promise<UserWallet> {
    try {
      const wallet = await this.getWalletForUser(user);

      if (!wallet) throw new BadRequestException('Wallet not found');
      const curr = Number(wallet?.balance);
      if (curr < Number(amount))
        throw new BadRequestException('Insufficient funds');
      if (Number(amount) <= 0) throw new BadRequestException('Invalid amount');
      const currentBallance = curr - Number(amount);
      wallet.balance = currentBallance;
      await wallet.save({
        transaction: dbTransaction,
      });
      await this.userTransactionService.createUserTransaction(
        {
          amount: Number(amount),
          type: TransactionType.TRANSFER,
          UserWalletId: wallet.id,
          status: TransactionStatus.COMPLETED,
          paymentPurpose: PaymentPurpose[`${paymentPurpose}`]
            ? PaymentPurpose[`${paymentPurpose}`]
            : PaymentPurpose.PROJECT,
          CreatedById: wallet?.UserId,
          ProjectId,
          description,

          paymentProvider: PaymentProvider[`${paymentProvider}`],
          paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
          RfqRequestId,
        },
        dbTransaction,
      );
      return wallet;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async transferFunds({
    amount,
    RfqRequestId,
    itemName,
    paymentType,
    dbTransaction,
    to,
    description,
    from,
  }: {
    amount: GLfloat;
    description: string;
    from: User;
    to: User;
    RfqRequestId?: string;
    itemName?: string;
    paymentType?: RfqRequestPaymentTerm;
    dbTransaction: Transaction;
  }): Promise<boolean> {
    try {
      const FromWallet = await this.getWalletForUser(from);
      const toWallet = await this.getWalletForUser(to);
      if (!FromWallet || !toWallet)
        throw new BadRequestException('cannot transfer funds to this account');
      const curr = Number(FromWallet?.balance);
      if (curr < Number(amount))
        throw new BadRequestException('Insufficient funds');
      if (Number(amount) <= 0) throw new BadRequestException('Invalid amount');
      FromWallet.ActualSpend = Number(FromWallet.ActualSpend) + Number(amount);
      await FromWallet.save({
        transaction: dbTransaction,
      });
      await this.userTransactionService.createUserTransaction(
        {
          amount: Number(amount),
          type: TransactionType.WITHDRAWAL,
          UserWalletId: FromWallet.id,
          status: TransactionStatus.COMPLETED,
          paymentPurpose: PaymentPurpose.RFQ_REQUEST,
          CreatedById: FromWallet?.UserId,
          itemName,
          paymentType,
          description: description ? description : `payment for ${itemName}`,
          paymentProvider: PaymentProvider.CUTSTRUCT,
          paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
        },
        dbTransaction,
      );
      await this.userTransactionService.createUserTransaction(
        {
          amount: Number(amount),
          type: TransactionType.DEPOSIT,
          UserWalletId: toWallet.id,
          status: TransactionStatus.COMPLETED,
          RfqRequestId,
          itemName,
          paymentType,
          paymentPurpose: PaymentPurpose.WALLET,
          CreatedById: toWallet?.UserId,
          description: `payment for ${itemName}`,
          paymentProvider: PaymentProvider.CUTSTRUCT,
          paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
        },
        dbTransaction,
      );
      let currTotalBalance = Number(toWallet.balance);
      currTotalBalance = Number(currTotalBalance) + Number(amount);
      const currTotalCredit = Number(toWallet.totalCredit) + Number(amount);
      toWallet.totalCredit = currTotalCredit;
      toWallet.balance = currTotalBalance;
      await toWallet.save({ transaction: dbTransaction });
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async genWalletForUser(user: User) {
    if (user.walletId == null) {
      const dbTransaction = await this.sequelize.transaction();
      try {
        const acn = await genAccountNumber(user.id);
        const wallet = await this.createWallet(
          {
            account_number: acn,
            createdAt: new Date(),
            CreatedById: user.id,
            UserId: user.id,
          },
          dbTransaction,
        );
        user.walletId = wallet.id;
        await user.save({ transaction: dbTransaction });
        await await dbTransaction.commit();
      } catch (error) {
        dbTransaction.rollback();
      }
    } else {
    }
  }
}

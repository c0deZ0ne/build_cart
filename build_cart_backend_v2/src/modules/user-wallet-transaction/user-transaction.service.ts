import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreationAttributes,
  Transaction as SequelizeTransaction,
  WhereOptions,
} from 'sequelize';
import {
  TransactionStatus,
  TransactionType,
  UserTransaction,
} from '../user-wallet-transaction/models/user-transaction.model';
import { Op } from 'sequelize';
import { RfqRequest, RfqRequestMaterial } from '../rfq/models';
import { User } from '../user/models/user.model';
import { RequestPayment } from '../vendor/dto/request-payment.dto';
import { Sequelize } from 'sequelize-typescript';
import { EmailService } from '../email/email.service';
import { PaymentMethod, SystemPaymentPurpose } from '../payment/types';

@Injectable()
export class UserTransactionService {
  constructor(
    @InjectModel(UserTransaction)
    private readonly userTransaction: typeof UserTransaction,
    private readonly sequelize: Sequelize,
    private readonly emailService: EmailService,
  ) {}

  async createUserTransaction(
    transactionData: CreationAttributes<UserTransaction>,
    dbTransaction: SequelizeTransaction,
  ): Promise<UserTransaction> {
    
    try {
      const data =  await this.userTransaction.create(transactionData, {
        transaction: dbTransaction,
      });
      return data 
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserTransactions(
    UserWalletId: string,
    transaction_type?: string,
    interval?: { start_date: Date; end_date: Date },
    searchParam?: string,
  ): Promise<UserTransaction[]> {
    const { start_date, end_date } = interval;

    const query: WhereOptions = {
      where: { UserWalletId },
      include: [
        {
          model: RfqRequest,
          include: [
            { model: User, as: 'CreatedBy' },
            { model: RfqRequestMaterial },
          ],
        },
        { model: User, as: 'CreatedBy' },
      ],
      order: [['createdAt', 'DESC']],
    };

    if (start_date && end_date) {
      query.where.createdAt = {
        [Op.between]: [start_date, end_date],
      };
    } else if (start_date) {
      query.where.createdAt = {
        [Op.gte]: start_date,
      };
    } else if (end_date) {
      query.where.createdAt = {
        [Op.lte]: end_date,
      };
    }

    if (transaction_type) {
      if (!['inflow', 'outflow', 'all'].includes(transaction_type)) {
        throw new BadRequestException(
          'transaction_type must be either inflow or outflow, all',
        );
      }
      if (transaction_type === 'inflow') {
        query.where.type = {
          [Op.in]: [TransactionType.DEPOSIT, TransactionType.REFUND],
        };
      } else if (transaction_type === 'outflow') {
        query.where.type = {
          [Op.in]: [TransactionType.WITHDRAWAL, TransactionType.TRANSFER],
        };
      } else if (transaction_type === 'all') {
        query.where.type = {
          [Op.in]: [
            TransactionType.WITHDRAWAL,
            TransactionType.TRANSFER,
            TransactionType.DEPOSIT,
            TransactionType.REFUND,
          ],
        };
      }
    }

    if (searchParam) {
      const numericValue = parseFloat(searchParam);

      if (!isNaN(numericValue)) {
        query.where[Op.or] = [
          { amount: numericValue },
          { description: { [Op.like]: `%${searchParam}%` } },
          { reference: { [Op.like]: `%${searchParam}%` } },
        ];
      } else {
        query.where[Op.or] = [
          { description: { [Op.like]: `%${searchParam}%` } },
          { reference: { [Op.like]: `%${searchParam}%` } },
        ];
      }
    }

    return await this.userTransaction.findAll(query);
  }

  async getUserTransactionData(UserWalletId: string) {
    const transactionHistory = await this.getUserTransactions(UserWalletId);
    let totalCredit = 0;
    let totalSpent = 0;

    transactionHistory.forEach((transaction) => {
      if (
        transaction.type === TransactionType.DEPOSIT &&
        transaction.status == TransactionStatus.COMPLETED
      ) {
        totalCredit += Number(transaction.amount);
      } else if (
        transaction.type === TransactionType.WITHDRAWAL &&
        transaction.status == TransactionStatus.COMPLETED
      ) {
        totalSpent += Number(transaction.amount);
      }
    });

    const formattedTotalCredit = totalCredit.toFixed(2);
    const formattedTotalSpent = totalSpent.toFixed(2);
    const formatedBallannce =
      Number(formattedTotalCredit) - Number(formattedTotalSpent);
    return {
      totalCredit: formattedTotalCredit,
      totalSpent: formattedTotalSpent,
      balance: formatedBallannce,
    };
  }

  async requestWalletPayout({
    user,
    body,
  }: {
    user: User;
    body: RequestPayment;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      if (user.wallet.balance < body.Amount)
        throw new BadRequestException('Insufficient account balance');
      await this.createUserTransaction(
        {
          UserWalletId: user.walletId,
          amount: -body.Amount,
          paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
          type: TransactionType.WITHDRAWAL,
          createdAt: new Date(),
          paymentPurpose: SystemPaymentPurpose.FUND_WALLET,
          itemName: 'Payment Request',
          status: TransactionStatus.PENDING,
          CreatedById: user.id,
          description: body.description,
        },
        dbTransaction,
      );
      const updatedActualSpend = Number(user.wallet.ActualSpend) + body.Amount;
      user.wallet.ActualSpend = updatedActualSpend;
      const updatedBalance = Number(user.wallet.balance) - body.Amount;
      user.wallet.balance = updatedBalance;
      await user.wallet.save({ transaction: dbTransaction });
      dbTransaction.commit();
      return await user.reload();
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async getResolvedTransactions(user: User) {
    return await this.userTransaction.findAll({
      where: {
        UserWalletId: user.walletId,
        CreatedById: user.id,
        status: TransactionStatus.COMPLETED,
      },
    });
  }

  async checkTransactionWithPayRef(pay_ref: string) {
    return await this.userTransaction.findOne({
      where: { reference: pay_ref },
    });
  }
   async  convertJsonToHtml(transactions: UserTransaction[]): Promise<string >{
      let htmlContent = "<!DOCTYPE html>";
      htmlContent += "<html>";
      htmlContent += "<head>";
      htmlContent += "<title>User Transactions Report</title>";
      htmlContent += "</head>";
      htmlContent += "<body>";
      htmlContent += "<h1>User Transactions Report</h1>";
      htmlContent += '<table border="1">';
      htmlContent += "<tr>";
      htmlContent += "<th>User Wallet ID</th>";
      htmlContent += "<th>Amount</th>";
      htmlContent += "<th>Payment Purpose</th>";
      htmlContent += "<th>Payment Method</th>";
      htmlContent += "<th>Payment Provider</th>";
      htmlContent += "<th>Project ID</th>";
      htmlContent += "<th>RFQ Request ID</th>";
      htmlContent += "<th>Item Name</th>";
      htmlContent += "<th>Payment Type</th>";
      htmlContent += "<th>Description</th>";
      htmlContent += "<th>Timestamp</th>";
      htmlContent += "<th>Type</th>";
      htmlContent += "<th>Status</th>";
      htmlContent += "<th>Meta</th>";
      htmlContent += "<th>Reference</th>";
      htmlContent += "<th>Created By ID</th>";
      htmlContent += "</tr>";
    
      transactions.forEach((transaction) => {
        htmlContent += "<tr>";
        htmlContent += `<td>${transaction.UserWalletId}</td>`;
        htmlContent += `<td>${transaction.amount}</td>`;
        htmlContent += `<td>${transaction.paymentPurpose}</td>`;
        htmlContent += `<td>${transaction.paymentMethod}</td>`;
        htmlContent += `<td>${transaction.paymentProvider}</td>`;
        htmlContent += `<td>${transaction.ProjectId}</td>`;
        htmlContent += `<td>${transaction.RfqRequestId}</td>`;
        htmlContent += `<td>${transaction.itemName}</td>`;
        htmlContent += `<td>${transaction.paymentType}</td>`;
        htmlContent += `<td>${transaction.description}</td>`;
        htmlContent += `<td>${transaction.timestamp}</td>`;
        htmlContent += `<td>${transaction.type}</td>`;
        htmlContent += `<td>${transaction.status}</td>`;
        htmlContent += `<td>${JSON.stringify(transaction.meta)}</td>`;
        htmlContent += `<td>${transaction.reference}</td>`;
        htmlContent += `<td>${transaction.CreatedById}</td>`;
        htmlContent += "</tr>";
      });
    
      htmlContent += "</table>";
      htmlContent += "</body>";
      htmlContent += "</html>";
    
      return htmlContent;
    }
  
    // async generatePdf(htmlContent: string): Promise<string> {
    //   const pdfOptions = { format: 'Letter' }; // You can customize the PDF options
    //   return new Promise<string>((resolve, reject) => {
    //     pdf.create(htmlContent, pdfOptions).toFile('./transactions.pdf', (err, res) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(res.filename);
    //       }
    //     });
    //   });
    // }
  
    async deletePdf(pdfFilePath: string): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        fs.unlink(pdfFilePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  
  
    async exportAccountTransactionHistory(user: User,
      transaction_type?: string,
      interval?: { start_date: Date; end_date: Date },
      searchParam?: string){
        const data = await this.getUserTransactions(user.walletId,transaction_type,interval,searchParam);
        const htmlContent =  await this.convertJsonToHtml(data);
        await this.emailService.sendEmailWithAttachment({ emailAddress: user.email, user_name: user.name || user.businessName, datas: data});
    }
}

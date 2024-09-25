import { InjectModel } from '@nestjs/sequelize';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from '../models/payment.model';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment.service';
import { User } from 'src/modules/user/models/user.model';
import { EmailService } from 'src/modules/email/email.service';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
} from 'src/modules/contract/models';
import {
  PaystackWebhookRequestData,
  initializePaymentData,
} from 'src/modules/project/types';
import {
  TransactionStatus,
  TransactionType,
} from 'src/modules/user-wallet-transaction/models/user-transaction.model';
import { UserWalletService } from 'src/modules/user-wallet/user-wallet.service';
import { UserTransactionService } from 'src/modules/user-wallet-transaction/user-transaction.service';
import { PlatformSubscriptionService } from 'src/modules/platfrom-subscription/platform-subacription.service';
import { Sequelize } from 'sequelize-typescript';
import { SubscriptionType } from 'src/modules/platfrom-subscription/types';
import {
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
  SystemPaymentPurpose,
} from '../types';
import { ProjectTransaction } from 'src/modules/project-wallet-transaction/models/project-transaction.model';
import { UserWallet } from 'src/modules/user-wallet/models/user-wallet.model';
import { ProjectWallet } from 'src/modules/project-wallet/models/project-wallet.model';
import { Order, OrderStatus } from 'src/modules/order/models';
import { Commission } from 'src/modules/escrow/models/commision.model';
import { Escrow, EscrowStatus } from 'src/modules/escrow/models/escrow.model';
import {
  Project,
  ProjectStatus,
} from 'src/modules/project/models/project.model';
import { generateReference } from 'src/util/util';

@Injectable()
export class PaystackPaymentService {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    @InjectModel(ProjectTransaction)
    private readonly projectTransactionModel: typeof ProjectTransaction,
    @InjectModel(UserWallet)
    private readonly userWalletModel: typeof UserWallet,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(ProjectWallet)
    private readonly projectWalletModel: typeof ProjectWallet,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Commission)
    private readonly commissionModel: typeof Commission,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Escrow)
    private readonly escrowModel: typeof Escrow,
    private paymentService: PaymentService,
    private userWalletService: UserWalletService,
    private readonly userTransactionService: UserTransactionService,
    private platformSubscriptionService: PlatformSubscriptionService,
    private readonly sequelize: Sequelize,

    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async initiateProjectWalletTransaction(data: initializePaymentData) {
    try {
      const { userId, reference, email, amount, metadata } = data;
      const res = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: amount * 100,
          reference,
          metadata,
          callback_url: `${this.configService.get(
            'CALLBACK_URL',
          )}&id=${userId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'PAYSTACK_SECRET',
            )}`,
            'Accept-Encoding': 'identity',
          },
        },
      );

      if (!res.data.status) return { error: 'Error initializing transaction' };
      const { authorization_url: paymentUrl } = res.data.data;
      return {
        data: {
          paymentUrl,
          reference,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async WalletTopUp({ user, pay_ref }: { user: User; pay_ref: string }) {
    try {
      const { data } = await axios.get(
        `https://api.paystack.co/transaction/verify/${pay_ref}`,
        {
          headers: {
            Authorization: `Bearer ${await this.configService.get(
              'PAYSTACK_SECRET',
            )}`,
          },
        },
      );

      if (data.data.status !== 'success')
        throw new BadRequestException('Payment not successful');

      const match_amount = data.data.amount / 100;

      await this.userWalletService.fundWallet({
        amount: match_amount,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentProvider: PaymentProvider.PAYSTACK,
        description: 'Wallet top-up',
        user: user,
        meta: data,
        ref: pay_ref,
        itemName: 'Wallet top up',
        transactionStatus: TransactionStatus.COMPLETED,
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyPaystackPayment(data: PaystackWebhookRequestData): Promise<any> {
    console.log('data from paystack ', data);
    const dbTransaction = await this.sequelize.transaction();
    const { userId, reference, amount, metadata } = data;
    try {
      const amountInNaira = amount / 100;

      const transaction = await this.paymentModel.findOne({
        where: {
          pay_ref: reference,
        },
        include: [{ model: UserWallet }],
      });
      if (!transaction) throw new NotFoundException('transaction not found');
      //check the purpose of the payment and perform the action
      if (
        transaction.paymentPurpose ===
        SystemPaymentPurpose.PLATFORM_SUBSCRIPTION
      ) {
        await this.platformSubscriptionService.createSubscription({
          type: SubscriptionType.PREMIUM,
          userId,
          dbTransaction,
        });

        await this.userTransactionService.createUserTransaction(
          {
            amount: amountInNaira,
            paymentMethod: transaction.paymentMethod,
            type: TransactionType.WITHDRAWAL,
            paymentProvider: PaymentProvider.PAYSTACK,
            paymentPurpose: transaction.paymentPurpose,
            status: TransactionStatus.COMPLETED,
            UserWalletId: transaction.UserWallet.id,
            description: 'Platform Subscription',
            // add here too
          },
          dbTransaction,
        );

        await this.userWalletModel.increment(
          {
            ActualSpend: amountInNaira,
          },
          { where: { id: transaction.walletId }, transaction: dbTransaction },
        );
      }
      //for project wallet transaction
      if (transaction.paymentPurpose === SystemPaymentPurpose.FUND_WALLET) {
        await this.userWalletModel.increment(
          {
            balance: amountInNaira,
            totalCredit: amountInNaira,
          },
          { where: { id: transaction.walletId }, transaction: dbTransaction },
        );

        await this.userTransactionService.createUserTransaction(
          {
            amount: amountInNaira,
            paymentMethod: transaction.paymentMethod,
            type: TransactionType.DEPOSIT,
            paymentProvider: PaymentProvider.PAYSTACK,
            paymentPurpose: transaction.paymentPurpose,
            status: TransactionStatus.COMPLETED,
            description: 'Fund Vault',
            UserWalletId: transaction?.walletId,
          },
          dbTransaction,
        );
      }
      //for project wallet transaction
      if (
        transaction.paymentPurpose === SystemPaymentPurpose.FUND_PROJECT_WALLET
      ) {
        await this.projectWalletModel.increment(
          {
            balance: amountInNaira,
            totalCredit: amountInNaira,
          },
          {
            where: { id: transaction.ProjectWalletId },
            transaction: dbTransaction,
          },
        );

        await this.userWalletModel.increment(
          {
            totalCredit: amountInNaira,
          },
          {
            where: { id: transaction.walletId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.update(
          {
            status: TransactionStatus.COMPLETED,
          },
          {
            where: { id: transaction.id },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.create(
          {
            walletId: transaction.walletId,
            ProjectWalletId: transaction.ProjectWalletId,
            amount: amountInNaira,
            ProjectId: metadata.projectId,
            description: 'order funded',
            userType: TransactionType.DEPOSIT,
            status: TransactionStatus.COMPLETED,
            paymentMethod: PaymentMethod.CREDIT_CARD,
            paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
            paymentPurpose: SystemPaymentPurpose.FUND_ORDER,
            reference: generateReference(),
            CreatedById: userId,
          },
          { transaction: dbTransaction },
        );
      }

      // do for order
      if (transaction.paymentPurpose === SystemPaymentPurpose.FUND_ORDER) {
        await this.contractModel.update(
          {
            status: ContractStatus.ACCEPTED,
            paymentStatus: ContractPaymentStatus.CONFIRMED,
          },
          {
            where: { ProjectId: metadata.projectId },
            transaction: dbTransaction,
          },
        );

        await this.orderModel.update(
          {
            status: OrderStatus.PAID,
          },
          {
            where: { id: metadata.orderId },
            transaction: dbTransaction,
            returning: true,
          },
        );

        const commission = await this.commissionModel.findOne({
          where: {
            active: true,
          },
        });

        const commision = (commission.percentageNumber / 100) * amount;
        const order = await this.orderModel.findOne({
          where: { id: metadata.orderId },
        });

        if (!order) throw new NotFoundException('order does not exist');
        const contract = await this.contractModel.findOne({
          where: { ProjectId: order.ProjectId },
        });

        if (!contract) throw new NotFoundException('contract does not exist');

        await this.escrowModel.create(
          {
            orderId: metadata.orderId,
            contractId: contract.id,
            projectId: metadata.projectId,
            rfqRequestId: order.RfqRequestId,
            initialPrice: amountInNaira,
            commisionPercentage: commission.percentageNumber,
            commisionValue: commision,
            finalAmount: amountInNaira - commision,
            status: EscrowStatus.PENDING,
          },
          { transaction: dbTransaction },
        );

        await this.projectModel.update(
          {
            status: ProjectStatus.ACTIVE,
          },
          {
            where: { id: metadata.projectId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.update(
          {
            status: TransactionStatus.COMPLETED,
          },
          {
            where: { id: transaction.id },
            transaction: dbTransaction,
          },
        );

        await this.projectModel.increment(
          {
            amountSpent: amountInNaira,
          },
          {
            where: { id: metadata.projectId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.create(
          {
            walletId: transaction.walletId,
            ProjectWalletId: transaction.ProjectWalletId,
            amount: amountInNaira,
            ProjectId: metadata.projectId,
            description: 'order funded',
            userType: TransactionType.DEPOSIT,
            status: TransactionStatus.COMPLETED,
            fee: commision,
            paymentMethod: PaymentMethod.CREDIT_CARD,
            paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
            paymentPurpose: SystemPaymentPurpose.FUND_ORDER,
            reference: generateReference(),
            CreatedById: userId,
          },
          { transaction: dbTransaction },
        );
        await dbTransaction.commit();
      }
      transaction.pay_status = PaymentStatus.SUCCESS;
      transaction.custom_data = { ...transaction.custom_data, ...data };
      await transaction.save({ transaction: dbTransaction });
      await dbTransaction.commit();
      return;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}
